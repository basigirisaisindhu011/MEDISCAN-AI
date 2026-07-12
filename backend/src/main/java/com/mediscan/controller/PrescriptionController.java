package com.mediscan.controller;

import java.security.Principal;
import java.util.List;

import com.mediscan.dto.ApiResponse;
import com.mediscan.dto.PrescriptionDto;
import com.mediscan.entity.User;
import com.mediscan.service.AuthService;
import com.mediscan.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {
  private final PrescriptionService prescriptionService;
  private final AuthService authService;

  public PrescriptionController(PrescriptionService prescriptionService, AuthService authService) {
    this.prescriptionService = prescriptionService;
    this.authService = authService;
  }

  @PostMapping("/upload")
  public ResponseEntity<ApiResponse<PrescriptionDto>> upload(@RequestParam("file") MultipartFile file, Principal principal) throws Exception {
    User user = authService.getCurrentUser(principal.getName()).orElseThrow();
    return ResponseEntity.ok(ApiResponse.success("Prescription uploaded successfully", prescriptionService.uploadPrescription(file, user)));
  }

  @GetMapping
  public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getAll(Principal principal) {
    User user = authService.getCurrentUser(principal.getName()).orElseThrow();
    return ResponseEntity.ok(ApiResponse.success(prescriptionService.getUserPrescriptions(user)));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<PrescriptionDto>> getById(@PathVariable Long id, Principal principal) {
    User user = authService.getCurrentUser(principal.getName()).orElseThrow();
    return ResponseEntity.ok(ApiResponse.success(prescriptionService.getPrescription(id, user)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, Principal principal) {
    User user = authService.getCurrentUser(principal.getName()).orElseThrow();
    prescriptionService.deletePrescription(id, user);
    return ResponseEntity.ok(ApiResponse.success("Prescription deleted", null));
  }
}
