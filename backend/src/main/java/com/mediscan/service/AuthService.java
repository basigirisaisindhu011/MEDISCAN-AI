package com.mediscan.service;

import java.util.Optional;

import com.mediscan.dto.AuthRequest;
import com.mediscan.dto.AuthResponse;
import com.mediscan.dto.LoginRequest;
import com.mediscan.entity.User;
import com.mediscan.repository.UserRepository;
import com.mediscan.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.authenticationManager = authenticationManager;
  }

  public AuthResponse register(AuthRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      throw new IllegalArgumentException("Email already exists");
    }
    User user = new User(request.name(), request.email(), passwordEncoder.encode(request.password()), User.Role.USER);
    userRepository.save(user);
    String token = jwtService.generateToken(user);
    return new AuthResponse(token, user);
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
    User user = userRepository.findByEmail(request.email()).orElseThrow();
    String token = jwtService.generateToken(user);
    return new AuthResponse(token, user);
  }

  public Optional<User> getCurrentUser(String email) {
    return userRepository.findByEmail(email);
  }
}
