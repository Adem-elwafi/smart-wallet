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
      <div className="w-full max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        Chargement de l'historique...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 shadow-sm">
        {error}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        Aucune transaction à afficher.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-100">
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
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div
                className={`p-2 rounded-full mr-4 flex-shrink-0 ${
                  isCredit
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {isCredit ? (
                  <ArrowDownLeft size={20} />
                ) : (
                  <ArrowUpRight size={20} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {isCredit ? 'Reçu de ' : 'Envoyé à '}
                  {isCredit ? tx.senderAccountNumber : tx.recipientAccountNumber}
                </p>

                {tx.description && (
                  <p className="text-xs text-slate-600 truncate">
                    {tx.description}
                  </p>
                )}

                <p className="text-xs text-slate-500 italic">
                  {formattedDate} à {formattedTime}
                </p>
              </div>

              <div
                className={`text-sm font-black whitespace-nowrap ml-4 ${
                  isCredit ? 'text-emerald-700' : 'text-rose-700'
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