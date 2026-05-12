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

export interface ApiError {
    message: string;
}