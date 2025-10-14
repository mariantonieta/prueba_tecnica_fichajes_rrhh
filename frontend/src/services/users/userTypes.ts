export type UserRole = "EMPLOYEE" | "RRHH";

export interface UserCreate {
  username: string;
  email: string;
  full_name: string;
  password: string;
  confirm_password: string;
  role?: UserRole; 
  initial_vacation_days?: number;
  initial_weekly_hours?: number;
  initial_monthly_hours?: number;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  full_name?: string;
  password?: string;
  is_active?: boolean;
  initial_vacation_days?: number;
  initial_weekly_hours?: number;
  initial_monthly_hours?: number;
  role?: UserRole;
}

export interface UserOut {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  role_id: string;
  role: UserRole;
  create_date: string;
  update_date?: string;
  initial_vacation_days?: number;
  initial_weekly_hours?: number;
  initial_monthly_hours?: number;
}
