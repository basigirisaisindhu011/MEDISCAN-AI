package com.mediscan.dto;

public record ApiResponse<T>(String message, T data) {
  public static <T> ApiResponse<T> success(String message, T data) {
    return new ApiResponse<>(message, data);
  }

  public static <T> ApiResponse<T> success(T data) {
    return new ApiResponse<>("Success", data);
  }
}
