// kotlin
package com.smartwallet.repository

import com.smartwallet.model.Transaction
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface TransactionRepository : JpaRepository<Transaction, Long> {
    /**
     * Récupère toutes les transactions d'un portefeuille (envoyées ou reçues)
     * @param walletId L'ID du portefeuille
     * @return La liste des transactions impliquant ce portefeuille
     */
    @Query("""
        SELECT t FROM Transaction t 
        LEFT JOIN t.receiverWallet rw
        WHERE t.senderWallet.id = :walletId OR rw.id = :walletId
        ORDER BY t.timestamp DESC
    """)
    fun findAllByWalletId(@Param("walletId") walletId: Long): List<Transaction>

    /**
     * Récupère les transactions envoyées par un portefeuille
     * @param walletId L'ID du portefeuille
     * @return La liste des transactions envoyées
     */
    fun findBySenderWalletIdOrderByTimestampDesc(walletId: Long): List<Transaction>

    /**
     * Récupère les transactions reçues par un portefeuille
     * @param walletId L'ID du portefeuille
     * @return La liste des transactions reçues
     */
    fun findByReceiverWalletIdOrderByTimestampDesc(walletId: Long): List<Transaction>
}
