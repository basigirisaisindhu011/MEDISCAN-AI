package com.mediscan.controller;

import java.util.List;

import com.mediscan.dto.ApiResponse;
import com.mediscan.dto.PrescriptionDto;
import com.mediscan.entity.User;
import com.mediscan.service.PrescriptionService;
import com.mediscan.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
  private final UserService userService;
  private final PrescriptionService prescriptionService;

  public AdminController(UserService userService, PrescriptionService prescriptionService) {
    this.userService = userService;
    this.prescriptionService = prescriptionService;
  }

  @GetMapping("/users")
  public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
    return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
  }

  @DeleteMapping("/users/{id}")
  public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
    userService.deleteUserById(id);
    return ResponseEntity.ok(ApiResponse.success("User deleted", null));
  }

  @GetMapping("/prescriptions")
  public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getAllPrescriptions() {
    return ResponseEntity.ok(ApiResponse.success(prescriptionService.getAllPrescriptionsForAdmin()));
  }
}
