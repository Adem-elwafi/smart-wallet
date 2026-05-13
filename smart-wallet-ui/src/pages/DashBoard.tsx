import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyWallet } from '../services/wallet.service';
import type { WalletResponse } from '../api/types';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullAccount, setShowFullAccount] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const data = await getMyWallet();
        setWallet(data);
      } catch (error: unknown) {
        // Redirection si le token est expiré ou invalide (401 ou 403)
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [navigate]);

  const formatAccountNumber = (number: string) => {
    if (showFullAccount) return number;
    return `${number.substring(0, 6)} •••• •••• ${number.slice(-2)}`;
  };

  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord</h1>
        <p className="mt-1 text-sm text-slate-600">Bienvenue dans votre SmartWallet</p>
      </div>

      {/* Carte de Crédit Stylisée */}
      <div className="relative w-full max-w-md h-56 bg-gradient-to-br from-blue-700 via-blue-900 to-black rounded-2xl p-6 shadow-2xl text-white overflow-hidden transform hover:scale-105 transition-transform duration-300">
        {/* Cercles décoratifs en arrière-plan */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
        
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">Solde Actuel</p>
            <h2 className="text-3xl font-bold mt-1">
              {wallet?.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} 
              <span className="text-lg ml-2">{wallet?.currency}</span>
            </h2>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
            <div className="w-10 h-6 bg-yellow-400/80 rounded-sm"></div> {/* Puce SIM simulée */}
          </div>
        </div>

        <div className="mt-auto relative z-10">
          <p className="text-blue-100 text-xs mb-1">Numéro de Compte</p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg tracking-widest">
              {wallet ? formatAccountNumber(wallet.accountNumber) : 'SW-XXXXXXXXXX'}
            </span>
            <button 
              onClick={() => setShowFullAccount(!showFullAccount)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-xs"
            >
              {showFullAccount ? 'Masquer' : 'Afficher'}
            </button>
            <button 
              onClick={copyToClipboard}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-xs"
            >
              {copied ? 'Copié!' : 'Copier'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Autres sections du dashboard ici */}
    </div>
  );
};

export default Dashboard;