import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { TransactionResponse } from '../api/types';
import { getTransactionHistory } from '../services/transaction.service';

interface TransactionsListProps {
  transactions?: TransactionResponse[];
  autoLoad?: boolean;
  onLoad?: (transactions: TransactionResponse[]) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions: initialTransactions = [],
  autoLoad = false,
  onLoad 
}) => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>(initialTransactions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoLoad && transactions.length === 0) {
      loadTransactions();
    }
  }, [autoLoad]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactionHistory();
      setTransactions(data);
      onLoad?.(data);
    } catch (err) {
      setError('Impossible de charger l\'historique des transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTransactions.length > 0) {
      setTransactions(initialTransactions);
    }
  }, [initialTransactions]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-xl border border-border bg-surface-elevated p-5 text-sm text-text-tertiary shadow-sm">
        Chargement de l'historique...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-xl border border-error bg-error-light p-5 text-sm text-error shadow-sm">
        {error}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-xl border border-border bg-surface-elevated p-5 text-sm text-text-tertiary shadow-sm">
        Aucune transaction à afficher.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-elevated rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="divide-y divide-border-light">
        {transactions?.map((tx) => {
          const isCredit = tx.type === 'CREDIT';
          const timestamp = new Date(tx.timestamp);
          const formattedDate = timestamp.toLocaleDateString('fr-FR');
          const formattedTime = timestamp.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 hover:bg-surface-subtle transition-colors"
            >
              <div
                className={`p-2 rounded-full mr-4 flex-shrink-0 ${
                  isCredit
                    ? 'bg-success-light text-success-dark'
                    : 'bg-error-light text-error'
                }`}
              >
                {isCredit ? (
                  <ArrowDownLeft size={20} />
                ) : (
                  <ArrowUpRight size={20} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary truncate">
                  {isCredit ? 'Reçu de ' : 'Envoyé à '}
                  {isCredit ? tx.senderAccountNumber : tx.recipientAccountNumber}
                </p>

                {tx.description && (
                  <p className="text-xs text-text-secondary truncate">
                    {tx.description}
                  </p>
                )}

                <p className="text-xs text-text-tertiary italic">
                  {formattedDate} à {formattedTime}
                </p>
              </div>

              <div
                className={`text-sm font-black whitespace-nowrap ml-4 ${
                  isCredit ? 'text-success-dark' : 'text-error'
                }`}
              >
                {isCredit ? '+' : '-'}
                {Math.abs(tx.amount).toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} TND
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionsList;