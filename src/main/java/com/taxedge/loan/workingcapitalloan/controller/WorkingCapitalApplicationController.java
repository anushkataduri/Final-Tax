package com.taxedge.loan.workingcapitalloan.controller;

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

import com.taxedge.loan.workingcapitalloan.dto.WorkingCapitalApplicationDto;
import com.taxedge.loan.workingcapitalloan.dto.WorkingCapitalDocumentDto;
import com.taxedge.loan.workingcapitalloan.service.WorkingCapitalApplicationService;
import com.taxedge.loan.workingcapitalloan.service.WorkingCapitalDocumentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/loan/working-capital")
@RequiredArgsConstructor
public class WorkingCapitalApplicationController {

    private final WorkingCapitalApplicationService service;
    
    private final WorkingCapitalDocumentService docservice;

    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody WorkingCapitalApplicationDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.saveApplication(dto));
    }

    @PutMapping("/update/{workingCapitalId}")
    public ResponseEntity<String> update(@PathVariable String workingCapitalId,
                                         @RequestBody WorkingCapitalApplicationDto dto) {
        return ResponseEntity.ok(service.updateApplication(workingCapitalId, dto));
    }

    @GetMapping("/{workingCapitalId}")
    public ResponseEntity<WorkingCapitalApplicationDto> get(
            @PathVariable String workingCapitalId) {
        return ResponseEntity.ok(service.getApplication(workingCapitalId));
    }

    @GetMapping
    public ResponseEntity<List<WorkingCapitalApplicationDto>> list() {
        return ResponseEntity.ok(service.getApplications());
    }
    
    
    @PostMapping("/documents/save/{workingCapitalId}")
    public ResponseEntity<String> save(@PathVariable String workingCapitalId,
                                       @RequestBody WorkingCapitalDocumentDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(docservice.saveDocuments(workingCapitalId, dto));
    }

    @PutMapping("/documents/update/{workingCapitalId}")
    public ResponseEntity<String> update(@PathVariable String workingCapitalId,
                                         @RequestBody WorkingCapitalDocumentDto dto) {
        return ResponseEntity.ok(docservice.updateDocuments(workingCapitalId, dto));
    }

    @GetMapping("/documents/{workingCapitalId}")
    public ResponseEntity<WorkingCapitalDocumentDto> getdoc(
            @PathVariable String workingCapitalId) {
        return ResponseEntity.ok(docservice.getDocuments(workingCapitalId));
    }
}
