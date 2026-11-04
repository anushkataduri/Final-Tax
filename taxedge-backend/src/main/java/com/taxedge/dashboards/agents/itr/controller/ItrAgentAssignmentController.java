package com.taxedge.dashboards.agents.itr.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.dashboards.agents.gst.dto.AssignAgentRequest;
import com.taxedge.dashboards.agents.itr.service.ItrAgentAssignmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/ca-manager/itr")
@RequiredArgsConstructor
public class ItrAgentAssignmentController {

    private final ItrAgentAssignmentService itrAgentAssignmentService;

    @PutMapping("/assign")
    public ResponseEntity<String> assignAgent(@Valid @RequestBody AssignAgentRequest request) {

        log.info("REST request to assign ITR application [{}] (type: [{}]) to agent [{}]",
                request.getApplicationId(), request.getApplicationType(), request.getAgentId());

        String message = itrAgentAssignmentService.assignApplication(
                request.getApplicationId(), request.getAgentId(), request.getApplicationType());

        return ResponseEntity.ok(message);
    }
}

