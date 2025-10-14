export interface RegisterData {
    username: string
    email: string
    full_name: string
    password: string
    confirm_password: string
    role: "EMPLOYEE" | "RRHH"
}

export interface RegisterResponse {
    message: string
    email: string
}

export interface LoginData {
    usernameOrEmail: string
    password: string
}

export interface TokenResponse {
    access_token: string
    token_type: string
}
