package com.mediscan.repository;

import java.util.List;

import com.mediscan.entity.Prescription;
import com.mediscan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
  List<Prescription> findByUserOrderByUploadedAtDesc(User user);
  List<Prescription> findAllByOrderByUploadedAtDesc();
}
