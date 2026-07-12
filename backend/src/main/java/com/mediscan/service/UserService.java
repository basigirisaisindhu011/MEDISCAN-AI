package com.mediscan.service;

import java.util.List;

import com.mediscan.entity.User;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User getUserProfile(String email) {
    return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  public User updateUserProfile(User user, String name, String email) {
    user.setName(name);
    user.setEmail(email);
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
