package com.mediscan.dto;

public record MedicineDto(
    Long id,
    String medicineName,
    String strength,
    String frequency,
    String duration,
    String instructions
) {
}
