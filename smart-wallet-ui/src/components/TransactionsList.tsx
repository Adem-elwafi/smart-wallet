import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Receipt, AlertCircle } from 'lucide-react';
import type { TransactionResponse } from '../api/types';
import { getTransactionHistory } from '../services/transaction.service';

interface TransactionsListProps {
  transactions?: TransactionResponse[];
  autoLoad?: boolean;
  onLoad?: (transactions: TransactionResponse[]) => void;
  currentAccountNumber?: string;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions: initialTransactions = [],
  autoLoad = false,
  onLoad,
  currentAccountNumber
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

  // Helper to split the amount into whole and decimal parts for premium typography
  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    const [whole, decimal] = absAmount.toFixed(2).split('.');
    const formattedWhole = parseInt(whole).toLocaleString('fr-FR');
    return { whole: formattedWhole, decimal };
  };

  if (loading) {
    return (
      <div className="w-full space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="flex items-center justify-between rounded-2xl bg-white/5 p-4 shadow-sm border border-white/10 animate-pulse backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded-md bg-white/10" />
                <div className="h-3 w-20 rounded-md bg-white/10" />
              </div>
            </div>
            <div className="h-6 w-24 rounded-md bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center shadow-sm backdrop-blur-sm">
        <AlertCircle className="mb-3 h-8 w-8 text-rose-400" />
        <p className="text-sm font-medium text-rose-300">{error}</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-white/10 text-white/30">
          <Receipt size={32} strokeWidth={1.5} />
        </div>
        <h3 className="mb-1 text-lg font-bold tracking-tight text-white/90">Aucune transaction</h3>
        <p className="text-sm font-medium text-white/50">Votre historique est vide pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {transactions?.map((tx) => {
        const isCredit = currentAccountNumber ? tx.recipientAccountNumber === currentAccountNumber : tx.type === 'CREDIT';
        const timestamp = new Date(tx.timestamp);
        const formattedDate = timestamp.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short' 
        });
        const formattedTime = timestamp.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const { whole, decimal } = formatAmount(tx.amount);

        return (
          <div
            key={tx.id}
            className="group flex items-center justify-between rounded-2xl bg-white/5 p-4 shadow-sm border border-white/5 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  isCredit
                    ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 group-hover:bg-rose-500/30'
                }`}
              >
                {isCredit ? (
                  <ArrowDownLeft size={22} strokeWidth={2.5} />
                ) : (
                  <ArrowUpRight size={22} strokeWidth={2.5} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-white">
                  {isCredit ? 'Reçu de ' : 'Envoyé à '}
                  <span className="text-white/70">
                    {isCredit ? tx.senderAccountNumber : tx.recipientAccountNumber}
                  </span>
                </p>

                {tx.description && (
                  <p className="mt-0.5 truncate text-xs font-medium text-white/50">
                    {tx.description}
                  </p>
                )}

                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
                  {formattedDate} • {formattedTime}
                </p>
              </div>
            </div>

            <div
              className={`ml-4 text-right tabular-nums tracking-tight ${
                isCredit ? 'text-emerald-400' : 'text-white'
              }`}
            >
              <div className="flex items-baseline justify-end gap-[1px]">
                <span className="text-sm font-bold">{isCredit ? '+' : '-'}</span>
                <span className="text-lg font-black">{whole}</span>
                <span className="text-xs font-bold opacity-75">,{decimal}</span>
                <span className="ml-1 text-xs font-bold uppercase opacity-60">TND</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionsList;