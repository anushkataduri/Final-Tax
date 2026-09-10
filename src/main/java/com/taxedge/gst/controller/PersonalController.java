//package com.taxedge.gst.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.taxedge.gst.dto.PersonalDto;
//import com.taxedge.gst.service.PersonalService;
//
//@RestController
//@RequestMapping("/gst/personal")
//public class PersonalController {
//
//    @Autowired
//    private PersonalService personalService;
//
//    @GetMapping("/{gstId}")
//    public ResponseEntity<PersonalDto> getPersonal(
//            @PathVariable String gstId) {
//
//        PersonalDto personalDto = personalService.getPersonalId(gstId);
//
//        return ResponseEntity.ok(personalDto);
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<String> registerPersonal(
//            @RequestBody PersonalDto personalDto) {
//
//        String result = personalService.registerPersonal(personalDto);
//
//        return new ResponseEntity<>(result, HttpStatus.CREATED);
//    }
//
//    @PutMapping("/update/{gstId}")
//    public ResponseEntity<String> updatePersonal(
//            @PathVariable String gstId,
//            @RequestBody PersonalDto personalDto) {
//
//        String result = personalService.updatePersonal(gstId, personalDto);
//
//        return ResponseEntity.ok(result);
//    }
//}