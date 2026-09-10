package com.taxedge.gst.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.gst.dto.BusinessDto;
import com.taxedge.gst.service.BusinessService;

@RestController
@RequestMapping("/gst/business")
public class BusinessController {

    private final BusinessService businessService;

    public BusinessController(BusinessService businessService) {
        this.businessService = businessService;
    }

    @GetMapping("/{businessId}")
    public ResponseEntity<BusinessDto> getBusiness(@PathVariable String businessId) {

        BusinessDto businessDto = businessService.getBusinessId(businessId);

        return ResponseEntity.ok(businessDto);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerBusiness(@RequestBody BusinessDto businessDto) {

        String result = businessService.registerBusiness(businessDto);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PutMapping("/update/{businessId}")
    public ResponseEntity<String> updateBusiness(@PathVariable String businessId,@RequestBody BusinessDto businessDto) {

        String result = businessService.updateBusiness(businessId, businessDto);

        return ResponseEntity.ok(result);
    }
}