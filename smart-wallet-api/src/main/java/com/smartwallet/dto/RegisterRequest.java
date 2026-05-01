package com.smartwallet.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import java.util.Set;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;

    @JsonAlias("role")
    private Set<String> roles;
}