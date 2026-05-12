import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { Transaction } from '../api/types';

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        Aucune transaction a afficher.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-100">
        {transactions?.map((tx) => {
          const isCredit = tx.type === 'CREDIT';

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div
                className={`p-2 rounded-full mr-4 ${
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
                  {tx.description || 'Transaction'}
                </p>

                <p className="text-xs text-slate-500 italic">
                  {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div
                className={`text-sm font-black ${
                  isCredit ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isCredit ? '+' : '-'}
                {Math.abs(tx.amount).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionsList;