import { axiosClient } from "../api/client"; 


export interface TimeOffRequestUpdate {
  status?: "APPROVED" | "REJECTED" | "PENDING";
  review_comment?: string;
}

export type LeaveTypeEnum = "VACATION" | "SICK" | "PERSONAL" | "OTHER";

export interface TimeOffRequestCreate {
  start_date: string;
  end_date: string;
  reason?: string;
  leave_type: LeaveTypeEnum;
}

export interface TimeOffRequestOut {
  id: string;
  user_id: string;
  full_name?: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: string;
  reason?: string;
  review_comment?: string;
  created_at: string;
  updated_at: string;
}

const BASE_URL = "/time_off_requests";

export const createTimeOffRequest = async (data: TimeOffRequestCreate) => {
  const res = await axiosClient.post<TimeOffRequestOut>(BASE_URL, data);
  return res.data;
};

export const getTimeOffRequest = async (id: string) => {
  const res = await axiosClient.get<TimeOffRequestOut>(`${BASE_URL}/${id}`);
  return res.data;
};
export const updateTimeOffRequest = async (
  id: string,
  data: TimeOffRequestUpdate
) => {
  const res = await axiosClient.patch<TimeOffRequestOut>(
    `${BASE_URL}/${id}`,
    data
  );
  return res.data;
};

export const listTimeOffRequests = async () => {
  const res = await axiosClient.get<TimeOffRequestOut[]>(BASE_URL);
  return res.data;
};
