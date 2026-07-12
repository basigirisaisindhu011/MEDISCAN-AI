package com.mediscan.dto;

import com.mediscan.entity.User;

public record AuthResponse(String token, User user) {
}
