package com.smartwallet.service;

import com.smartwallet.dto.AuthenticationResponse;
import com.smartwallet.dto.LoginRequest;
import com.smartwallet.dto.RegisterRequest;
import com.smartwallet.model.User;
import com.smartwallet.repository.UserRepository;
import com.smartwallet.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public User register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // On encode le mot de passe avant de l'enregistrer
        user.setPassword(passwordEncoder.encode(request.getPassword()));

                Set<String> roles = request.getRoles();
                if (roles == null || roles.isEmpty()) {
                        roles = Set.of("user");
                }
                user.setRoles(new HashSet<>(roles));

        return userRepository.save(user);
    }

    public AuthenticationResponse authenticate(LoginRequest request) {
        // Vérifie si les identifiants sont corrects
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Si l'authentification réussit, on génère le token
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}