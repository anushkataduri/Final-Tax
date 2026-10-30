package com.taxedge.dashboards.auth.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.dashboards.auth.dto.AgentLoginDto;
import com.taxedge.dashboards.auth.enums.AgentRole;
import com.taxedge.dashboards.auth.service.AgentLoginService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for agent accounts: the administrator manages them under
 * /api/v1/admin/agents. Sign-in is LoginController (/api/v1/auth/login).
 */
@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AgentLoginController {

    private final AgentLoginService agentLoginService;

    @PostMapping("/admin/agents")
    public ResponseEntity<AgentLoginDto> createAgent(@RequestBody AgentLoginDto agentLoginDto) {
        log.info("Received request to create agent: {}", agentLoginDto.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(agentLoginService.createAgent(agentLoginDto));
    }

    /** All agents, one role's with ?role=CA_AGENT, or one manager's team with ?managerId=1. */
    @GetMapping("/admin/agents")
    public ResponseEntity<List<AgentLoginDto>> getAgents(
            @RequestParam(required = false) AgentRole role,
            @RequestParam(required = false) Long managerId) {
        log.info("Received request for agents with role: {} and managerId: {}", role, managerId);
        return ResponseEntity.ok(managerId != null
                ? agentLoginService.getAgentsByManager(managerId)
                : agentLoginService.getAgents(role));
    }

    @GetMapping("/admin/agents/{id}")
    public ResponseEntity<AgentLoginDto> getAgentById(@PathVariable Long id) {
        log.info("Received request for agent with id: {}", id);
        return ResponseEntity.ok(agentLoginService.getAgentById(id));
    }

    @PutMapping("/admin/agents/{id}")
    public ResponseEntity<AgentLoginDto> updateAgent(
            @PathVariable Long id,
            @RequestBody AgentLoginDto agentLoginDto) {
        log.info("Received request to update agent with id: {}", id);
        return ResponseEntity.ok(agentLoginService.updateAgent(id, agentLoginDto));
    }

    @DeleteMapping("/admin/agents/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long id) {
        log.info("Received request to delete agent with id: {}", id);
        agentLoginService.deleteAgent(id);
        return ResponseEntity.noContent().build();
    }
}
