package com.smartwallet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Envoie une mise à jour du solde du wallet à l'utilisateur spécifié en temps réel.
     * @param username Le nom d'utilisateur destinataire
     * @param balancePayload L'objet contenant les informations de mise à jour (solde, etc.)
     */
    public void sendWalletUpdate(String username, Object balancePayload) {
        String destination = "/topic/wallet/" + username;
        messagingTemplate.convertAndSend(destination, balancePayload);
    }
}