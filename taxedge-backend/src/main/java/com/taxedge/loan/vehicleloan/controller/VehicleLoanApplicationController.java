package com.taxedge.loan.vehicleloan.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.loan.vehicleloan.dto.VehicleLoanApplicationDto;
import com.taxedge.loan.vehicleloan.service.VehicleLoanApplicationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/loan/vehicle-loans")
@RequiredArgsConstructor
public class VehicleLoanApplicationController {

    private final VehicleLoanApplicationService service;

    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody VehicleLoanApplicationDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.saveApplication(dto));
    }

    @PutMapping("update/{id}")
    public ResponseEntity<String> update(@PathVariable String id,
                                         @RequestBody VehicleLoanApplicationDto dto) {
        return ResponseEntity.ok(service.updateApplication(id, dto));
    }

    @PutMapping("/submit/{id}")
    public ResponseEntity<String> submit(@PathVariable String id) {
        return ResponseEntity.ok(service.submitApplication(id));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<VehicleLoanApplicationDto> get(@PathVariable String id) {
        return ResponseEntity.ok(service.getApplication(id));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<VehicleLoanApplicationDto>> getMine() {
        return ResponseEntity.ok(service.getMyApplications());
    }
}
