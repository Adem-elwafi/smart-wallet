package com.smartwallet.dto;

import com.smartwallet.model.User;

public record ProfileResponse(
        String username,
        String email,
        String fullName,
        String avatarUrl
) {
    public static ProfileResponse fromUser(User user) {
        return new ProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl()
        );
    }
}