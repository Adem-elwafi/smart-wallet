import api from '../api/axiosConfig';
import type { TransactionResponse, TransferRequest } from '../api/types';

/**
 * Initiate a transfer between wallets
 */
export const initiateTransfer = async (transferRequest: TransferRequest): Promise<TransactionResponse> => {
  const response = await api.post('/v1/transactions/transfer', transferRequest);
  return response.data;
};

/**
 * Get the transaction history for the logged-in user
 */
export const getTransactionHistory = async (): Promise<TransactionResponse[]> => {
  const response = await api.get('/v1/transactions/history');
  return response.data;
};
