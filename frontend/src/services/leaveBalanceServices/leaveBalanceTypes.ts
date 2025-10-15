export interface LeaveBalance {
  id: string;
  user_id: string;
  leave_type: string;
  remaining_days: number;
  year: number;
  user_name: string;
  total_days: number;
  used_days: number;
}

export interface LeaveBalanceCreate {
  user_id: string;
  leave_type: string;
  remaining_days?: number;
  total_days?: number;
  year: number;
}

export interface LeaveBalanceUpdate {
  remaining_days?: number;
  leave_type?: string;
  year?: number;
}