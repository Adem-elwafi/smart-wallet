export interface AuthResponse {
    token: string;
    username: string;
    email?: string;
}

export interface WalletResponse {
    accountNumber: string;
    balance: number;
    currency: string;
}

export interface Transaction {
    id: number;
    amount: number;
    timestamp: string;
    type: 'DEBIT' | 'CREDIT';
    description: string;
    senderAccountNumber: string;
    recipientAccountNumber: string;
}

export interface TransactionResponse {
    id: number;
    amount: number;
    timestamp: string;
    type: string;
    description: string;
    senderAccountNumber: string;
    recipientAccountNumber: string;
}

export interface WalletSummary {
    accountNumber: string;
    balance: number;
    currency: string;
}

export interface TransferRequest {
    recipientAccountNumber: string;
    amount: number;
    description?: string;
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

export interface ApiError {
    message: string;
}
