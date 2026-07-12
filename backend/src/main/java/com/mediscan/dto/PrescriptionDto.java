package com.mediscan.dto;

import java.util.List;

public record PrescriptionDto(
    Long id,
    String imagePath,
    String extractedText,
    String doctorName,
    String hospitalName,
    String prescriptionDate,
    List<MedicineDto> medicines
) 
{
}
