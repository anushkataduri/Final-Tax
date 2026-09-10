//package com.taxedge.gst.service;
//
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.taxedge.gst.dto.PersonalDto;
//import com.taxedge.gst.entity.Personal;
//import com.taxedge.gst.exception.ResourceNotFoundException;
//import com.taxedge.gst.helper.randomNumberGenerator;
//import com.taxedge.gst.repository.PersonalRepository;
//
//@Service
//public class PersonalServiceImpl implements PersonalService {
//
//    @Autowired
//    private PersonalRepository personalRepository;
//
//    @Autowired
//    private ModelMapper modelMapper;
//
//    @Override
//    public String registerPersonal(PersonalDto personalDto) {
//
//        Personal personal = modelMapper.map(personalDto, Personal.class);
//
//        personal.setGstId(randomNumberGenerator.generateGstId());
//
//        personalRepository.save(personal);
//
//        return "Personal details registered successfully";
//    }
//
//    @Override
//    public String updatePersonal(String gstId, PersonalDto personalDto) {
//
//        Personal personal = personalRepository.findById(gstId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Personal details not found with gstId: " + gstId));
//
//        modelMapper.map(personalDto, personal);
//
//        personal.setGstId(gstId);
//
//        personalRepository.save(personal);
//
//        return "Personal details updated successfully";
//    }
//
//    @Override
//    public PersonalDto getPersonalId(String gstId) {
//
//        Personal personal = personalRepository.findById(gstId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Personal details not found with gstId: " + gstId));
//
//        return modelMapper.map(personal, PersonalDto.class);
//    }
//}