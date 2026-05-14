package com.smartwallet.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String email;
    private String fullName;
    private String avatarUrl;
}