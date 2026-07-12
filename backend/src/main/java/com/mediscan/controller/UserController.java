package com.mediscan.controller;

import java.security.Principal;

import com.mediscan.dto.ApiResponse;
import com.mediscan.entity.User;
import com.mediscan.service.AuthService;
import com.mediscan.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
  private final UserService userService;
  private final AuthService authService;

  public UserController(UserService userService, AuthService authService) {
    this.userService = userService;
    this.authService = authService;
  }

  @GetMapping("/profile")
  public ResponseEntity<ApiResponse<User>> getProfile(Principal principal) {
    User user = authService.getCurrentUser(principal.getName()).orElseThrow();
    return ResponseEntity.ok(ApiResponse.success(user));
  }

  @PutMapping("/profile")
  public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody User update, Principal principal) {
    User user = authService.getCurrentUser(principal.getName()).orElseThrow();
    return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateUserProfile(user, update.getName(), update.getEmail())));
  }
}
