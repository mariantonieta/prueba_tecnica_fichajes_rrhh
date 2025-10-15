import { axiosClient } from "../api/client";

export interface TimeTrackingCreate {
    record_type: "CHECK_IN" | "CHECK_OUT";
    description?: string;
}

export interface TimeTrackingOut {
    id: string;
    user_id: string;
    record_type: string;
    timestamp: string;
    create_date: string;
    description?: string;
}

function getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No JWT token found");
    return { Authorization: `Bearer ${token}` };
}

export interface PaginatedResponse<T> {
  total: number;
  count: number;
  limit: number;
  offset: number;
  results: T[];
}
export const timeTrackingService = {
    async create(data: TimeTrackingCreate): Promise<TimeTrackingOut> {
        const res = await axiosClient.post("/time-tracking/", data, {
            headers: getAuthHeaders(),
        });
        return res.data;
    },

     async list(limit: number = 10, offset: number = 0): Promise<PaginatedResponse<TimeTrackingOut>> {
    const res = await axiosClient.get("/time-tracking/", {
      headers: getAuthHeaders(),
      params: { limit, offset },
    });
    return res.data;
  },

    async getWeeklyHours(weekStart: string): Promise<{ hours_worked: number; weekly_limit: number; over_limit: number }> {
        const res = await axiosClient.get("/time-tracking/weekly", {
            headers: getAuthHeaders(),
            params: { week_start: weekStart },
        });
        return res.data;
    },

    async getMonthlyHours(year: number, month: number): Promise<{ hours_worked: number; monthly_limit: number; over_limit: number }> {
        const res = await axiosClient.get("/time-tracking/monthly", {
            headers: getAuthHeaders(),
            params: { year, month },
        });
        return res.data;
    },

    async getEmployeeRecords(userId: string): Promise<TimeTrackingOut[]> {
        const res = await axiosClient.get(`/time-tracking/user/${userId}`);
        return res.data;
    },

    async searchEmployees(full_name?: string): Promise<TimeTrackingOut[]> {
        const res = await axiosClient.get("/time-tracking/search", {
            params: { user_full_name: full_name },
        });
        return res.data;
    },
};
