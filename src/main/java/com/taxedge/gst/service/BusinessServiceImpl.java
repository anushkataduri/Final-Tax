package com.taxedge.gst.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.gst.dto.BusinessDto;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.helper.RandomNumberGenerator;
import com.taxedge.gst.repository.BusinessRepository;

@Service
public class BusinessServiceImpl implements BusinessService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public String registerBusiness(BusinessDto businessDto) {

        Business business = modelMapper.map(businessDto, Business.class);

        String businessId = RandomNumberGenerator.generateGstId();

        business.setBusinessId(businessId);

        businessRepository.save(business);

        return "Business details registered successfully. Business ID: " + businessId;
    }

    @Override
    public String updateBusiness(String businessId, BusinessDto businessDto) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Business details not found with businessId: " + businessId));

        modelMapper.map(businessDto, business);

        business.setBusinessId(businessId);

        businessRepository.save(business);

        return "Business details updated successfully";
    }

    @Override
    public BusinessDto getBusinessId(String businessId) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Business details not found with businessId: " + businessId));

        return modelMapper.map(business, BusinessDto.class);
    }
}