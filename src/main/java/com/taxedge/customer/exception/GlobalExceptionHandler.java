package com.taxedge.customer.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Component("customerGlobalExceptionHandler")
public class GlobalExceptionHandler {

	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<Map<String, Object>> handleDuplicate(DuplicateResourceException ex) {
	    Map<String, Object> body = new LinkedHashMap<>();
	    body.put("timestamp", LocalDateTime.now());
	    body.put("status", HttpStatus.CONFLICT.value());
	    body.put("error", ex.getMessage());
	    body.put("field", ex.getField());
	    return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Map<String, Object>> handleConstraint(DataIntegrityViolationException ex) {
	    Map<String, Object> body = new LinkedHashMap<>();
	    body.put("timestamp", LocalDateTime.now());
	    body.put("status", HttpStatus.CONFLICT.value());
	    String rootMsg = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
	    if (rootMsg != null && rootMsg.contains("check constraint")) {
	        body.put("error", "Constraint violation: " + rootMsg);
	    } else if (rootMsg != null && (rootMsg.contains("unique constraint") || rootMsg.contains("duplicate key"))) {
	        body.put("error", "A record with this information already exists.");
	    } else {
	        body.put("error", "Data integrity violation: " + (rootMsg != null ? rootMsg : "Invalid data"));
	    }
	    return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
	}
	
	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
	    Map<String, Object> body = new LinkedHashMap<>();
	    body.put("timestamp", LocalDateTime.now());
	    body.put("status", HttpStatus.UNAUTHORIZED.value());
	    body.put("error", ex.getMessage());
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
	}
}
