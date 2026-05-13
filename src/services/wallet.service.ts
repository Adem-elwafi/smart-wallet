import api from '../api/axiosConfig';
import type { WalletResponse } from '../api/types';

export const getMyWallet = async (): Promise<WalletResponse> => {
  const response = await api.get('/v1/wallet/me');
  return response.data;
};
