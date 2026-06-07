import React, { useEffect, useState, useMemo } from 'react';
import { Receipt, AlertCircle, Search, Download, Filter } from 'lucide-react';
import type { TransactionResponse } from '../api/types';
import { getTransactionHistory } from '../services/transaction.service';

interface TransactionsListProps {
  transactions?: TransactionResponse[];
  autoLoad?: boolean;
  onLoad?: (transactions: TransactionResponse[]) => void;
  currentAccountNumber?: string;
  showControls?: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions: initialTransactions = [],
  autoLoad = false,
  onLoad,
  currentAccountNumber,
  showControls = false
}) => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>(initialTransactions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

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

  const categoryConfig: Record<string, { label: string, icon: string }> = {
    'ALIMENTATION': { label: 'Alimentation', icon: '🛒' },
    'TRANSPORT': { label: 'Transport', icon: '🚌' },
    'LOISIRS': { label: 'Loisirs', icon: '🎬' },
    'SHOPPING': { label: 'Shopping', icon: '💳' },
    'REVENUS': { label: 'Revenus', icon: '💰' },
    'AUTRE': { label: 'Autre', icon: '💳' }
  };

  const getTransactionDisplay = (tx: TransactionResponse) => {
    const config = tx.category ? categoryConfig[tx.category] : null;
    const icon = config?.icon || '💳';
    const label = (!tx.description || tx.description.trim() === '') && config 
      ? config.label 
      : (tx.description || (tx.type === 'CREDIT' ? 'Virement Reçu' : 'Achat'));

    return { label, icon };
  };

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const isCredit = currentAccountNumber 
        ? tx.recipientAccountNumber === currentAccountNumber 
        : tx.type === 'CREDIT';

      // 1. Filter by type
      if (selectedType === 'CREDIT' && !isCredit) return false;
      if (selectedType === 'DEBIT' && isCredit) return false;

      // 2. Filter by category
      if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) return false;

      // 3. Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const description = (tx.description || '').toLowerCase();
        const sender = (tx.senderAccountNumber || '').toLowerCase();
        const recipient = (tx.recipientAccountNumber || '').toLowerCase();
        const categoryLabel = tx.category ? (categoryConfig[tx.category]?.label || '').toLowerCase() : '';

        const matches = 
          description.includes(query) || 
          sender.includes(query) || 
          recipient.includes(query) || 
          categoryLabel.includes(query);

        if (!matches) return false;
      }

      return true;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType, currentAccountNumber]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Description', 'Catégorie', 'Expéditeur', 'Destinataire', 'Montant (EUR)'];
    
    const rows = filteredTransactions.map(tx => {
      const isCredit = currentAccountNumber ? tx.recipientAccountNumber === currentAccountNumber : tx.type === 'CREDIT';
      const formattedDate = tx.timestamp ? new Date(tx.timestamp).toLocaleString('fr-FR') : '';
      return [
        tx.id,
        formattedDate,
        isCredit ? 'CREDIT' : 'DEBIT',
        tx.description || '',
        tx.category || '',
        tx.senderAccountNumber || '',
        tx.recipientAccountNumber || '',
        `${isCredit ? '' : '-'}${tx.amount}`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create download with UTF-8 BOM
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `releve_smartwallet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="text-zinc-500 py-4 text-center">Chargement des transactions...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-rose-300 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
        <AlertCircle size={20} />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters row */}
      {showControls && (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Rechercher une transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-xs text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-amber-300/50"
              />
            </div>
            
            {/* Export CSV Button */}
            <button
              onClick={exportToCSV}
              disabled={filteredTransactions.length === 0}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-black px-4 py-2.5 text-xs font-semibold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)] shrink-0"
            >
              <Download className="h-4 w-4" />
              Exporter en CSV
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5 mr-1">
              <Filter className="h-3 w-3" /> Filtrer :
            </span>

            {/* Type Selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-zinc-300 outline-none hover:border-white/20 transition-all cursor-pointer"
            >
              <option value="ALL">Tous les types</option>
              <option value="CREDIT">Recettes (+)</option>
              <option value="DEBIT">Dépenses (-)</option>
            </select>

            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-zinc-300 outline-none hover:border-white/20 transition-all cursor-pointer"
            >
              <option value="ALL">Toutes les catégories</option>
              {Object.entries(categoryConfig).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.icon} {value.label}
                </option>
              ))}
            </select>

            <span className="text-[10px] text-zinc-500 ml-auto font-light">
              {filteredTransactions.length} transaction(s) trouvée(s)
            </span>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
            <Receipt size={40} className="mb-4 opacity-25" />
            <p className="text-sm font-light">Aucune transaction correspondante</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isCredit = currentAccountNumber 
              ? tx.recipientAccountNumber === currentAccountNumber 
              : tx.type === 'CREDIT';
            const { label, icon } = getTransactionDisplay(tx);
            
            return (
              <div key={tx.id} className="flex items-center justify-between p-3.5 rounded-xl border border-transparent transition-all hover:bg-white/[0.02] hover:border-white/5 group">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    isCredit ? 'bg-amber-400/10 text-amber-300' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-100 group-hover:text-amber-200 transition-colors">
                      {label}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {isCredit 
                        ? `Reçu de : ${tx.senderAccountNumber}` 
                        : `Envoyé à : ${tx.recipientAccountNumber || 'Dépense'}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold tabular-nums ${isCredit ? 'text-amber-300' : 'text-zinc-100'}`}>
                    {isCredit ? '+' : '-'}{tx.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </div>
                  {tx.timestamp && (
                    <p className="text-[9px] text-zinc-600 mt-1 font-light">
                      {new Date(tx.timestamp).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionsList;