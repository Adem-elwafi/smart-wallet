export interface AuthResponse {
    token: string;
    username: string;
    email?: string;
}

export interface ApiError {
    message: string;
}