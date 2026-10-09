package com.taxedge.customer.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.SimpleTransactionStatus;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.transaction.support.TransactionTemplate;

import com.taxedge.customer.config.LoginProperties;
import com.taxedge.customer.dto.CustomerDto;
import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.exception.DuplicateResourceException;
import com.taxedge.customer.mapper.CustomerMapper;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.messaging.service.EmailService;
import com.taxedge.notification.service.FcmNotificationService;
import com.taxedge.security.jwt.CustomerJwt;
import com.taxedge.security.jwt.service.JwtService;
import com.taxedge.security.jwt.service.RefreshTokenService;
import com.taxedge.security.otp.proof.RegistrationProofException;
import com.taxedge.security.otp.proof.RegistrationProofProperties;
import com.taxedge.security.otp.proof.RegistrationProofService;
import com.taxedge.security.otp.proof.RegistrationProofTestSupport.MutableClock;
import com.taxedge.security.otp.proof.RegistrationProofTestSupport.Store;
import com.taxedge.shared.concurrency.KeyedLock;

/** /customer/register is only reachable with a valid, unspent, matching OTP-verification proof. */
class CustomerRegistrationProofTest {

    private static final String MOBILE = "9876543210";

    private MutableClock clock;
    private RegistrationProofService proofs;
    private CustomerRepository repository;
    private CustomerServiceImpl service;
    private final List<Customer> saved = new ArrayList<>();

    @BeforeEach
    void setUp() {
        TransactionSynchronizationManager.initSynchronization();
        clock = new MutableClock(Instant.parse("2026-01-01T10:00:00Z"));
        proofs = new RegistrationProofService(new Store().repository, new RegistrationProofProperties(), clock);

        repository = mock(CustomerRepository.class);
        when(repository.save(any(Customer.class))).thenAnswer(inv -> {
            Customer customer = inv.getArgument(0);
            synchronized (saved) {
                saved.add(customer);
            }
            return customer;
        });

        CustomerMapper mapper = mock(CustomerMapper.class);
        when(mapper.toEntity(any(CustomerDto.class))).thenAnswer(inv -> {
            CustomerDto dto = inv.getArgument(0);
            return Customer.builder().name(dto.getName()).email(dto.getEmail()).mobileNumber(dto.getMobileNumber()).build();
        });

        PasswordEncoder encoder = mock(PasswordEncoder.class);
        when(encoder.encode(anyString())).thenReturn("hashed");
        JwtService jwtService = mock(JwtService.class);
        when(jwtService.generateToken(any(), any(), any())).thenReturn("access-token");
        RefreshTokenService refreshTokens = mock(RefreshTokenService.class);
        when(refreshTokens.createRefreshToken(any(Customer.class))).thenReturn("refresh-token");
        PlatformTransactionManager txManager = mock(PlatformTransactionManager.class);
        when(txManager.getTransaction(any())).thenAnswer(inv -> new SimpleTransactionStatus());

        service = new CustomerServiceImpl(
                mapper,
                mock(FcmNotificationService.class),
                repository,
                encoder,
                jwtService,
                refreshTokens,
                mock(EmailService.class),
                proofs,
                new LoginProperties(),
                clock,
                new KeyedLock(),
                new TransactionTemplate(txManager));
    }

    @AfterEach
    void tearDown() {
        TransactionSynchronizationManager.clearSynchronization();
    }

    private static CustomerDto registration(String mobile) {
        CustomerDto dto = new CustomerDto();
        dto.setName("Asha");
        dto.setEmail("asha@example.com");
        dto.setMobileNumber(mobile);
        dto.setPassword("246810");
        return dto;
    }

    private String codeOf(Callable<?> action) {
        return assertThrows(RegistrationProofException.class, () -> action.call()).getCode();
    }

    @Test
    void registersWithAValidProofForTheSameNumber() {
        String proof = proofs.issueForRegistration(MOBILE).token();

        CustomerJwt jwt = service.registerCustomer(registration(MOBILE), proof);

        assertNotNull(jwt);
        assertEquals("access-token", jwt.getAccessToken());
        assertEquals(1, saved.size());
    }

    @Test
    void refusesRegistrationWithoutAProof() {
        assertEquals(RegistrationProofException.REQUIRED, codeOf(() -> service.registerCustomer(registration(MOBILE), null)));
        assertEquals(RegistrationProofException.REQUIRED, codeOf(() -> service.registerCustomer(registration(MOBILE), " ")));

        assertEquals(0, saved.size());
        verify(repository, never()).save(any());
        verify(repository, never()).existsByMobileNumber(any());
    }

    @Test
    void refusesAnInvalidProof() {
        proofs.issueForRegistration(MOBILE);

        assertEquals(RegistrationProofException.INVALID,
                codeOf(() -> service.registerCustomer(registration(MOBILE), "forged-token")));
        assertEquals(0, saved.size());
    }

    @Test
    void refusesAnExpiredProof() {
        String proof = proofs.issueForRegistration(MOBILE).token();
        clock.advance(Duration.ofMinutes(31));

        assertEquals(RegistrationProofException.EXPIRED, codeOf(() -> service.registerCustomer(registration(MOBILE), proof)));
        assertEquals(0, saved.size());
    }

    @Test
    void refusesAProofThatWasAlreadyUsed() {
        String proof = proofs.issueForRegistration(MOBILE).token();
        service.registerCustomer(registration(MOBILE), proof);

        assertEquals(RegistrationProofException.ALREADY_USED,
                codeOf(() -> service.registerCustomer(registration("9876543210"), proof)));
        assertEquals(1, saved.size());
    }

    @Test
    void refusesAProofIssuedForAnotherNumber() {
        String proofForSomeoneElse = proofs.issueForRegistration("9123456789").token();

        assertEquals(RegistrationProofException.MOBILE_MISMATCH,
                codeOf(() -> service.registerCustomer(registration(MOBILE), proofForSomeoneElse)));
        assertEquals(0, saved.size());
    }

    @Test
    void refusesWhenTheRegistrationHasNoMobileNumber() {
        String proof = proofs.issueForRegistration(MOBILE).token();

        assertEquals(RegistrationProofException.MOBILE_MISMATCH,
                codeOf(() -> service.registerCustomer(registration(null), proof)));
        assertEquals(0, saved.size());
    }

    @Test
    void theProofCheckRunsBeforeAnyAccountDataIsTouched() {
        when(repository.existsByMobileNumber(anyString())).thenReturn(true);

        // Without a proof the caller learns nothing about which numbers are already registered.
        assertEquals(RegistrationProofException.REQUIRED, codeOf(() -> service.registerCustomer(registration(MOBILE), null)));
        verify(repository, never()).existsByMobileNumber(any());
    }

    @Test
    void aRegistrationRefusedForDuplicateDataStillReportsTheDuplicate() {
        String proof = proofs.issueForRegistration(MOBILE).token();
        when(repository.existsByMobileNumber(MOBILE)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> service.registerCustomer(registration(MOBILE), proof));
        verify(repository, times(1)).existsByMobileNumber(MOBILE);
        assertEquals(0, saved.size());
    }

    @Test
    void concurrentRegistrationsWithOneProofCreateExactlyOneAccount() throws Exception {
        String proof = proofs.issueForRegistration(MOBILE).token();
        int threads = 30;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch ready = new CountDownLatch(threads);
        CountDownLatch go = new CountDownLatch(1);
        List<Future<Boolean>> results = new ArrayList<>();
        for (int i = 0; i < threads; i++) {
            results.add(pool.submit(() -> {
                // synchronization state is per thread
                TransactionSynchronizationManager.initSynchronization();
                try {
                    ready.countDown();
                    go.await();
                    service.registerCustomer(registration(MOBILE), proof);
                    return true;
                } catch (RegistrationProofException refused) {
                    return false;
                } finally {
                    TransactionSynchronizationManager.clearSynchronization();
                }
            }));
        }
        ready.await();
        go.countDown();
        int created = 0;
        for (Future<Boolean> result : results) {
            if (result.get()) {
                created++;
            }
        }
        pool.shutdownNow();

        assertEquals(1, created);
        assertEquals(1, saved.size());
    }
}
