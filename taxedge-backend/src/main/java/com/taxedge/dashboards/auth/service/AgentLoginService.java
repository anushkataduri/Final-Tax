package com.taxedge.dashboards.auth.service;

import java.util.List;

import com.taxedge.dashboards.auth.dto.AgentLoginDto;
import com.taxedge.dashboards.auth.enums.AgentRole;

/**
 * Service interface for agent accounts: the administrator creates, lists,
 * updates and deletes them. Agents sign in through LoginService.
 */
public interface AgentLoginService {

    AgentLoginDto createAgent(AgentLoginDto agentLoginDto);

    /** All agents A–Z, or only one role's when role is not null. */
    List<AgentLoginDto> getAgents(AgentRole role);

    /** The agents who report to one manager, A–Z. */
    List<AgentLoginDto> getAgentsByManager(Long managerId);

    AgentLoginDto getAgentById(Long id);

    /** A blank password keeps the current one. */
    AgentLoginDto updateAgent(Long id, AgentLoginDto agentLoginDto);

    void deleteAgent(Long id);

}
