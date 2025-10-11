export type UserRole = "EMPLOYEE" | "RRHH";

export interface UserCreate {
    username: string
    email: string
    full_name: string
    password: string
    confirm_password: string
    role: UserRole
}

export interface UserUpdate {
    username?: string
    email?: string
    full_name?: string
    password?: string
    is_active?: boolean
    role?: UserRole
}

export interface UserOut {
    id: string
    username: string
    email: string
    full_name?: string
    is_active: boolean
    role_id: string
    role: UserRole
    create_date: string
    update_date?: string
}
