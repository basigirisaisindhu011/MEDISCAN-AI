package com.mediscan.config;

import com.mediscan.entity.User;
import com.mediscan.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@mediscan.com")) {
            User admin = new User("System Admin", "admin@mediscan.com", passwordEncoder.encode("admin123"), User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Default Admin User created: admin@mediscan.com / admin123");
        }

        if (!userRepository.existsByEmail("user@mediscan.com")) {
            User user = new User("Demo User", "user@mediscan.com", passwordEncoder.encode("user123"), User.Role.USER);
            userRepository.save(user);
            System.out.println("✅ Default Regular User created: user@mediscan.com / user123");
        }
    }
}
