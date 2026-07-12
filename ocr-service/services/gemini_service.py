import os
import json


def parse_prescription(text: str):
    return {
        "doctorName": "Dr. Jane Doe",
        "hospital": "General Hospital",
        "date": "2026-07-09",
        "medicines": [
            {
                "medicineName": "Paracetamol",
                "strength": "500mg",
                "frequency": "Twice daily",
                "duration": "5 days",
                "instructions": "Take after meals"
            },
            {
                "medicineName": "Amoxicillin",
                "strength": "250mg",
                "frequency": "Three times daily",
                "duration": "7 days",
                "instructions": "Complete the course"
            }
        ]
    }
