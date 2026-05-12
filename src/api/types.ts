export interface AuthResponse {
    token: string;
    username: string;
    email?: string;
}

export interface ApiError {
    message: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  category: string | null;
  description: string;
  createdAt: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
}

export interface WalletSummary {
  accountNumber: string;
  balance: number;
}

export interface TransferRequest {
  toAccountNumber: string;
  amount: number;
  description?: string;
  category?: string;
}

export interface Profile {
  username: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface UpdateProfileRequest {
  email: string;
  fullName: string;
  avatarUrl: string;
}
