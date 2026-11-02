package com.taxedge.dashboards.auth.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.dashboards.auth.dto.ManagerLoginDto;
import com.taxedge.dashboards.auth.entity.ManagerLogin;
import com.taxedge.dashboards.auth.enums.ManagerRole;
import com.taxedge.dashboards.auth.helper.ManagerLoginHelper;
import com.taxedge.dashboards.auth.mapper.ManagerLoginMapper;
import com.taxedge.dashboards.auth.repository.ManagerLoginRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of ManagerLoginService for manager account management
 * and manager sign-in. Passwords are stored only as BCrypt hashes.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ManagerLoginServiceImpl implements ManagerLoginService {

    private final ManagerLoginRepository managerLoginRepository;
    private final ManagerLoginMapper managerLoginMapper;
    private final PasswordEncoder passwordEncoder;
    private final ManagerLoginHelper managerLoginHelper;

    @Override
    @Transactional
    public ManagerLoginDto createManager(ManagerLoginDto managerLoginDto) {
        String email = managerLoginHelper.normalizeEmail(managerLoginDto.getEmail());
        log.info("Creating manager account for: {}", email);

        managerLoginHelper.ensureEmailIsFree(email, null);
        managerLoginHelper.ensureNotAgentEmail(email);
        managerLoginHelper.ensurePasswordGiven(managerLoginDto.getPassword());

        ManagerLogin manager = managerLoginMapper.toEntity(managerLoginDto);
        manager.setEmail(email);
        manager.setPassword(passwordEncoder.encode(managerLoginDto.getPassword()));

        return managerLoginMapper.toDto(managerLoginRepository.save(manager));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ManagerLoginDto> getManagers(ManagerRole role) {
        List<ManagerLogin> managers = role == null
                ? managerLoginRepository.findAllByOrderByFullNameAsc()
                : managerLoginRepository.findByRoleOrderByFullNameAsc(role);
        return managers.stream().map(managerLoginMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ManagerLoginDto getManagerById(Long id) {
        return managerLoginMapper.toDto(managerLoginHelper.findManager(id));
    }

    @Override
    @Transactional
    public ManagerLoginDto updateManager(Long id, ManagerLoginDto managerLoginDto) {
        log.info("Updating manager with id: {}", id);
        ManagerLogin manager = managerLoginHelper.findManager(id);

        if (managerLoginDto.getEmail() != null) {
            String email = managerLoginHelper.normalizeEmail(managerLoginDto.getEmail());
            managerLoginHelper.ensureEmailIsFree(email, id);
            managerLoginHelper.ensureNotAgentEmail(email);
            managerLoginDto.setEmail(email);
        }

        managerLoginMapper.updateEntityFromDto(managerLoginDto, manager);

        if (managerLoginDto.getPassword() != null && !managerLoginDto.getPassword().isBlank()) {
            manager.setPassword(passwordEncoder.encode(managerLoginDto.getPassword()));
        }

        return managerLoginMapper.toDto(managerLoginRepository.save(manager));
    }

    @Override
    @Transactional
    public void deleteManager(Long id) {
        log.info("Deleting manager with id: {}", id);
        ManagerLogin manager = managerLoginHelper.findManager(id);
        managerLoginHelper.ensureHasNoAgents(id);
        managerLoginRepository.delete(manager);
    }
}
