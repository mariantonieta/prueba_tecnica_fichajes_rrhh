import { axiosClient } from "../api/client";
import { LeaveBalance, LeaveBalanceCreate, LeaveBalanceUpdate } from "./leaveBalanceTypes";

const normalizeBalance = (b: any): LeaveBalance => {
  const totalDays = Number(b.total_days ?? b.remaining_days ?? 0);
  const remainingDays = Number(b.remaining_days ?? 0);

  const usedDays = totalDays - remainingDays;

  return {
    id: b.id,
    user_id: b.user_id,
    user_name: b.user_name || "N/A",
    leave_type: b.leave_type,
    remaining_days: remainingDays,
    total_days: totalDays,
    used_days: Math.max(0, usedDays),
    year: b.year || new Date().getFullYear(),
  };
};

export const getMyBalance = async (): Promise<LeaveBalance | null> => {
  try {
    const { data } = await axiosClient.get<any>("/leave_balances/me");
    return normalizeBalance(data);
  } catch (error) {
    console.error("Error fetching my balance:", error);
    return null;
  }
};

export const listAllBalances = async (): Promise<LeaveBalance[]> => {
  try {
    const { data } = await axiosClient.get<any[]>("/leave_balances/");
    return data.map(normalizeBalance);
  } catch (error) {
    console.error("Error fetching all balances:", error);
    return [];
  }
};

export const createBalance = async (
  payload: LeaveBalanceCreate
): Promise<LeaveBalance> => {
  const { data } = await axiosClient.post<any>(
    "/leave_balances/",
    payload
  );
  return normalizeBalance(data);
};

export const updateBalance = async (
  balanceId: string,
  payload: LeaveBalanceUpdate
): Promise<LeaveBalance> => {
  const { data } = await axiosClient.patch<any>(
    `/leave_balances/${balanceId}`,
    payload
  );
  return normalizeBalance(data);
};

export const accrueMonthly = async (
  userId: string
): Promise<LeaveBalance> => {
  const { data } = await axiosClient.post<any>(
    `/leave_balances/${userId}/accrue`
  );
  return normalizeBalance(data);
};