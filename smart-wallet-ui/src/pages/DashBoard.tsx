import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Correction des chemins d'importation (remonter de deux niveaux)
import TransactionsList from '../../../src/components/TransactionsList';
import TransferForm from '../../../src/components/TransferForm';
import { getMyWallet } from '../../../src/services/wallet.service';
import { getTransactionHistory } from '../../../src/services/transaction.service';
import type { TransactionResponse, WalletResponse } from '../../../src/api/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullAccount, setShowFullAccount] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletData, txData] = await Promise.all([
        getMyWallet(),
        getTransactionHistory(),
      ]);
      setWallet(walletData);
      setTransactions(txData);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const errorMessage = err.response?.data?.message;
        setError(typeof errorMessage === 'string' ? errorMessage : 'Impossible de charger les données.');
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const formatAccountNumber = (number: string): string => {
    if (showFullAccount) return number;
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-text-tertiary">Chargement...</div>;

  return (
    <div className="space-y-8">
      {/* Header & Carte Bancaire Stylisée */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tableau de Bord</h1>
          <p className="mt-1 text-sm text-text-secondary">Bienvenue dans votre SmartWallet</p>
        </div>

        <div className="relative h-48 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-primary to-black p-6 text-white shadow-xl md:ml-auto">
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent opacity-20 blur-2xl"></div>
          
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-accent-light">Solde Actuel</p>
              <h2 className="mt-1 text-2xl font-bold">
                {wallet?.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) ?? '0,00'} 
                <span className="ml-2 text-lg">{wallet?.currency ?? 'TND'}</span>
              </h2>
            </div>
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-md">
              <div className="h-5 w-8 rounded-sm bg-yellow-400/80"></div>
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <p className="mb-1 text-[10px] text-accent-lighter uppercase tracking-widest">Numéro de Compte</p>
            <div className="flex items-center gap-4">
              <span className="font-mono text-lg tracking-[0.2em]">
                {wallet ? formatAccountNumber(wallet.accountNumber) : '•••• •••• •••• ••••'}
              </span>
              <button 
                onClick={() => setShowFullAccount(!showFullAccount)}
                className="rounded-md bg-white/10 px-2 py-1 text-[10px] hover:bg-white/20 transition-colors"
              >
                {showFullAccount ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grille principale : Transfert Rapide & Historique */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Transfert Rapide</h2>
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-6 shadow-sm">
            <TransferForm onTransferSuccess={loadData} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Historique</h2>
          {error && <div className="p-3 text-sm text-error-dark bg-error-light rounded-xl border border-error">{error}</div>}
          <div className="rounded-2xl border border-border-light bg-surface-elevated p-6 shadow-sm">
            <TransactionsList transactions={transactions} autoLoad={true} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;