package com.taxedge.dashboards.auth.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.dashboards.auth.dto.AgentLoginDto;
import com.taxedge.dashboards.auth.entity.AgentLogin;
import com.taxedge.dashboards.auth.enums.AgentRole;
import com.taxedge.dashboards.auth.helper.AgentLoginHelper;
import com.taxedge.dashboards.auth.mapper.AgentLoginMapper;
import com.taxedge.dashboards.auth.repository.AgentLoginRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of AgentLoginService for agent account management
 * and agent sign-in. Passwords are stored only as BCrypt hashes.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AgentLoginServiceImpl implements AgentLoginService {

    private final AgentLoginRepository agentLoginRepository;
    private final AgentLoginMapper agentLoginMapper;
    private final PasswordEncoder passwordEncoder;
    private final AgentLoginHelper agentLoginHelper;

    @Override
    @Transactional
    public AgentLoginDto createAgent(AgentLoginDto agentLoginDto) {
        String email = agentLoginHelper.normalizeEmail(agentLoginDto.getEmail());
        log.info("Creating agent account for: {}", email);

        agentLoginHelper.ensureEmailIsFree(email, null);
        agentLoginHelper.ensurePasswordGiven(agentLoginDto.getPassword());

        AgentLogin agent = agentLoginMapper.toEntity(agentLoginDto);
        agent.setEmail(email);
        agent.setManager(agentLoginHelper.findManagerFor(agentLoginDto.getManagerId(), agentLoginDto.getRole()));
        agent.setPassword(passwordEncoder.encode(agentLoginDto.getPassword()));

        return agentLoginMapper.toDto(agentLoginRepository.save(agent));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AgentLoginDto> getAgents(AgentRole role) {
        List<AgentLogin> agents = role == null
                ? agentLoginRepository.findAllByOrderByFullNameAsc()
                : agentLoginRepository.findByRoleOrderByFullNameAsc(role);
        return agents.stream().map(agentLoginMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AgentLoginDto> getAgentsByManager(Long managerId) {
        return agentLoginRepository.findByManagerIdOrderByFullNameAsc(managerId).stream()
                .map(agentLoginMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AgentLoginDto getAgentById(Long id) {
        return agentLoginMapper.toDto(agentLoginHelper.findAgent(id));
    }

    @Override
    @Transactional
    public AgentLoginDto updateAgent(Long id, AgentLoginDto agentLoginDto) {
        log.info("Updating agent with id: {}", id);
        AgentLogin agent = agentLoginHelper.findAgent(id);

        if (agentLoginDto.getEmail() != null) {
            String email = agentLoginHelper.normalizeEmail(agentLoginDto.getEmail());
            agentLoginHelper.ensureEmailIsFree(email, id);
            agentLoginDto.setEmail(email);
        }

        // A new role or manager is checked against the other, so the agent always reports within its team.
        AgentRole role = agentLoginDto.getRole() != null ? agentLoginDto.getRole() : agent.getRole();
        Long managerId = agentLoginDto.getManagerId() != null ? agentLoginDto.getManagerId() : agent.getManager().getId();
        agent.setManager(agentLoginHelper.findManagerFor(managerId, role));

        agentLoginMapper.updateEntityFromDto(agentLoginDto, agent);

        if (agentLoginDto.getPassword() != null && !agentLoginDto.getPassword().isBlank()) {
            agent.setPassword(passwordEncoder.encode(agentLoginDto.getPassword()));
        }

        return agentLoginMapper.toDto(agentLoginRepository.save(agent));
    }

    @Override
    @Transactional
    public void deleteAgent(Long id) {
        log.info("Deleting agent with id: {}", id);
        agentLoginRepository.delete(agentLoginHelper.findAgent(id));
    }
}
