import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wallet, Send, History, Eye, EyeOff, RefreshCcw } from 'lucide-react'; // Icônes pour le côté pro

import TransactionsList from '../components/TransactionsList';
import TransferForm from '../components/TransferForm';
import { getMyWallet } from '../services/wallet.service';
import { getTransactionHistory } from '../services/transaction.service';
import type { TransactionResponse, WalletResponse } from '../api/types';

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
        setError(err.response?.data?.message || 'Erreur de connexion au serveur.');
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <RefreshCcw className="w-10 h-10 text-sky-600 animate-spin" />
        <p className="text-slate-500 font-medium italic">Préparation de votre espace sécurisé...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-10">
      {/* SECTION HEADER & WALLET CARD */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Bonjour, <span className="text-sky-600">Adem</span> 👋
          </h1>
          <p className="text-slate-500 text-lg">Ravi de vous revoir sur votre SmartWallet.</p>
        </div>

        {/* CARTE FINTECH STYLISÉE */}
        <div className="relative w-full max-w-md h-56 rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-8 text-white shadow-2xl overflow-hidden group transition-transform hover:scale-[1.02]">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl group-hover:bg-sky-500/20 transition-colors"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/80">Solde Total</p>
              <div className="text-3xl font-bold flex items-baseline gap-2">
                {wallet?.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) ?? '0,00'}
                <span className="text-lg font-medium text-sky-200">{wallet?.currency ?? 'TND'}</span>
              </div>
            </div>
            <Wallet className="w-10 h-10 text-sky-400 opacity-80" />
          </div>

          <div className="relative z-10 mt-12 flex justify-between items-end">
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Numéro de Compte</p>
              <p className="font-mono text-xl tracking-wider">
                {showFullAccount ? wallet?.accountNumber : `•••• •••• •••• ${wallet?.accountNumber.slice(-4)}`}
              </p>
            </div>
            <button 
              onClick={() => setShowFullAccount(!showFullAccount)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
              title={showFullAccount ? "Masquer" : "Afficher"}
            >
              {showFullAccount ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* GRILLE PRINCIPALE */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE 1 : ACTION (TRANSFERT) */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Send className="w-5 h-5 text-sky-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Envoyer de l'argent</h2>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 transition-shadow hover:shadow-md">
            <TransferForm onTransferSuccess={loadData} />
          </div>
        </aside>

        {/* COLONNES 2 & 3 : ACTIVITÉ (HISTORIQUE) */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-100 rounded-lg">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Activités Récentes</h2>
            </div>
            <button onClick={loadData} className="text-sm text-sky-600 hover:underline font-medium">Actualiser</button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3">
              <span className="flex-1 text-sm">{error}</span>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <TransactionsList transactions={transactions} autoLoad={true} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;