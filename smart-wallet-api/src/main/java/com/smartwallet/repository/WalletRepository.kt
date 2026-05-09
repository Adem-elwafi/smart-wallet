// kotlin
package com.smartwallet.repository

import com.smartwallet.model.Wallet
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface WalletRepository : JpaRepository<Wallet, Long> {
    /**
     * Trouve le portefeuille associé à un utilisateur spécifique.
     * @param userId L'ID de l'utilisateur
     * @return Un Optional contenant le portefeuille s'il existe
     */
    fun findByUserId(userId: Long): Optional<Wallet>

    /**
     * Optionnel : Trouve un portefeuille par son numéro de compte unique.
     */
    fun findByAccountNumber(accountNumber: String): Optional<Wallet>
}