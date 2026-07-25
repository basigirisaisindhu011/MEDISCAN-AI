package com.mediscan.service;

import java.util.List;

import com.mediscan.entity.User;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User getUserProfile(String email) {
    return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  public User updateUserProfile(User user, String name, String email, String password) {
    if (name != null && !name.trim().isEmpty()) {
      user.setName(name);
    }
    if (email != null && !email.trim().isEmpty()) {
      user.setEmail(email);
    }
    if (password != null && !password.trim().isEmpty()) {
      user.setPassword(passwordEncoder.encode(password));
    }
    return userRepository.save(user);
  }

  public void deleteUserById(Long id) {
    if (!userRepository.existsById(id)) {
      throw new ResourceNotFoundException("User not found");
    }
    userRepository.deleteById(id);
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }
}
