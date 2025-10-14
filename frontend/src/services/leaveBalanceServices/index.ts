import { axiosClient } from "../api/client";
import { LeaveBalance, LeaveBalanceCreate, LeaveBalanceUpdate } from "./leaveBalanceTypes";


export const getMyBalance = async (): Promise<LeaveBalance> => {
  const { data } = await axiosClient.get<LeaveBalance>("/leave_balances/me");
  return data;
};

export const listAllBalances = async (): Promise<LeaveBalance[]> => {
  const { data } = await axiosClient.get<LeaveBalance[]>("/leave_balances/");
  return data;
};

export const createBalance = async (
  payload: LeaveBalanceCreate
): Promise<LeaveBalance> => {
  const { data } = await axiosClient.post<LeaveBalance>(
    "/leave_balances/",
    payload
  );
  return data;
};

export const updateBalance = async (
  balanceId: string,
  payload: LeaveBalanceUpdate
): Promise<LeaveBalance> => {
  const { data } = await axiosClient.patch<LeaveBalance>(
    `/leave_balances/${balanceId}`,
    payload
  );
  return data;
};

export const accrueMonthly = async (userId: string): Promise<LeaveBalance> => {
  const { data } = await axiosClient.post<LeaveBalance>(
    `/leave_balances/${userId}/accrue`
  );
  return data;
};
