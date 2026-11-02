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

import com.taxedge.dashboards.auth.dto.ManagerLoginDto;
import com.taxedge.dashboards.auth.enums.ManagerRole;
import com.taxedge.dashboards.auth.service.ManagerLoginService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for manager accounts: the administrator manages them under
 * /api/v1/admin/managers. Sign-in is LoginController (/api/v1/auth/login).
 */

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ManagerLoginController {

    private final ManagerLoginService managerLoginService;

    @PostMapping("/admin/managers")
    public ResponseEntity<ManagerLoginDto> createManager(@RequestBody ManagerLoginDto managerLoginDto) {
        log.info("Received request to create manager: {}", managerLoginDto.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(managerLoginService.createManager(managerLoginDto));
    }

    @GetMapping("/admin/managers")
    public ResponseEntity<List<ManagerLoginDto>> getManagers(@RequestParam(required = false) ManagerRole role) {
        log.info("Received request for managers with role: {}", role);
        return ResponseEntity.ok(managerLoginService.getManagers(role));
    }

    @GetMapping("/admin/managers/{id}")
    public ResponseEntity<ManagerLoginDto> getManagerById(@PathVariable Long id) {
        log.info("Received request for manager with id: {}", id);
        return ResponseEntity.ok(managerLoginService.getManagerById(id));
    }

    @PutMapping("/admin/managers/{id}")
    public ResponseEntity<ManagerLoginDto> updateManager(
            @PathVariable Long id,
            @RequestBody ManagerLoginDto managerLoginDto) {
        log.info("Received request to update manager with id: {}", id);
        return ResponseEntity.ok(managerLoginService.updateManager(id, managerLoginDto));
    }

    @DeleteMapping("/admin/managers/{id}")
    public ResponseEntity<Void> deleteManager(@PathVariable Long id) {
        log.info("Received request to delete manager with id: {}", id);
        managerLoginService.deleteManager(id);
        return ResponseEntity.noContent().build();
    }
}
