package com.mediscan.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.mediscan.client.OcrClient;
import com.mediscan.dto.PrescriptionDto;
import com.mediscan.entity.Medicine;
import com.mediscan.entity.Prescription;
import com.mediscan.entity.User;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PrescriptionService {
  private final PrescriptionRepository prescriptionRepository;
  private final OcrClient ocrClient;

  public PrescriptionService(PrescriptionRepository prescriptionRepository, OcrClient ocrClient) {
    this.prescriptionRepository = prescriptionRepository;
    this.ocrClient = ocrClient;
  }

  public PrescriptionDto uploadPrescription(MultipartFile file, User user) throws Exception {
    String uploadDir = "uploads";
    Files.createDirectories(Paths.get(uploadDir));
    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
    Path path = Paths.get(uploadDir, fileName);
    Files.write(path, file.getBytes());

    Map<String, Object> response = ocrClient.processImage(file.getBytes());
    String extractedText = String.valueOf(response.getOrDefault("text", ""));
    Map<String, Object> parsed = (Map<String, Object>) response.getOrDefault("parsed", Map.of());

    Prescription prescription = new Prescription();
    prescription.setImagePath(path.toString());
    prescription.setExtractedText(extractedText);
    prescription.setDoctorName(String.valueOf(parsed.getOrDefault("doctorName", "")));
    prescription.setHospitalName(String.valueOf(parsed.getOrDefault("hospital", "")));
    prescription.setPrescriptionDate(String.valueOf(parsed.getOrDefault("date", "")));
    prescription.setUser(user);

    List<Map<String, Object>> parsedMedicines = (List<Map<String, Object>>) parsed.getOrDefault("medicines", List.of());
    List<Medicine> medicines = new ArrayList<>();
    for (Map<String, Object> medicineData : parsedMedicines) {
      Medicine medicine = new Medicine();
      medicine.setMedicineName(String.valueOf(medicineData.getOrDefault("medicineName", "")));
      medicine.setStrength(String.valueOf(medicineData.getOrDefault("strength", "")));
      medicine.setFrequency(String.valueOf(medicineData.getOrDefault("frequency", "")));
      medicine.setDuration(String.valueOf(medicineData.getOrDefault("duration", "")));
      medicine.setInstructions(String.valueOf(medicineData.getOrDefault("instructions", "")));
      medicine.setPrescription(prescription);
      medicines.add(medicine);
    }
    prescription.setMedicines(medicines);
    Prescription saved = prescriptionRepository.save(prescription);
    return toDto(saved);
  }

  public List<PrescriptionDto> getUserPrescriptions(User user) {
    return prescriptionRepository.findByUserOrderByUploadedAtDesc(user).stream().map(this::toDto).toList();
  }

  public PrescriptionDto getPrescription(Long id, User user) {
    Prescription prescription = prescriptionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
    if (!prescription.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
      throw new ResourceNotFoundException("Prescription not found");
    }
    return toDto(prescription);
  }

  public void deletePrescription(Long id, User user) {
    Prescription prescription = prescriptionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
    if (!prescription.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
      throw new ResourceNotFoundException("Prescription not found");
    }
    prescriptionRepository.delete(prescription);
  }

  public List<PrescriptionDto> getAllPrescriptionsForAdmin() {
    return prescriptionRepository.findAllByOrderByUploadedAtDesc().stream().map(this::toDto).toList();
  }

  private PrescriptionDto toDto(Prescription prescription) {
    return new PrescriptionDto(
        prescription.getId(),
        prescription.getImagePath(),
        prescription.getExtractedText(),
        prescription.getDoctorName(),
        prescription.getHospitalName(),
        prescription.getPrescriptionDate(),
        prescription.getMedicines().stream().map(m -> new com.mediscan.dto.MedicineDto(
            m.getId(),
            m.getMedicineName(),
            m.getStrength(),
            m.getFrequency(),
            m.getDuration(),
            m.getInstructions())).toList()
    );
  }
}
