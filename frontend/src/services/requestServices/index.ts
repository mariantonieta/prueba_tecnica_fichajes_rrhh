import { axiosClient } from "../api/client";

export type LeaveStatus = "approved" | "pending" | "rejected";
export type LeaveType = "VACATION" | "SICK_LEAVE" | "REMOTE_WORK" | "OTHER";

export interface RequestOut {
    id: string;
    type: LeaveType;
    date: string;
    status: LeaveStatus;
    statusLabel: string;
    reason?: string;
    reviewed_by?: string;
    review_comment?: string;
    userId: string;
    full_name: string;
}

export interface RequestCreate {
    start_date: string;
    end_date: string;
    leave_type: LeaveType;
    days_requested: number;
    reason: string;
}

interface BackendRequest {
    id: string;
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    status: LeaveStatus;
    user_id: string;
    full_name: string;
    reason?: string;
    reviewed_by?: string;
    review_comment?: string;
}
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const requestService = {
    async list(): Promise<RequestOut[]> {
        const res = await axiosClient.get<BackendRequest[]>("/time-off-requests");
        return res.data.map((r) => ({
            id: r.id,
            type: r.leave_type,
            date: `${r.start_date} - ${r.end_date}`,
            status: r.status,
            statusLabel: capitalize(r.status),
            reason: r.reason,
            reviewed_by: r.reviewed_by,
            review_comment: r.review_comment,
            userId: r.user_id,
            full_name: r.full_name
        }));
    },

    async create(data: RequestCreate): Promise<RequestOut> {
        const res = await axiosClient.post<BackendRequest>("/time-off-requests", data);
        const r = res.data;
        return {
            id: r.id,
            type: r.leave_type,
            date: `${r.start_date} - ${r.end_date}`,
            status: r.status,
            statusLabel: capitalize(r.status),
            reason: r.reason,
            reviewed_by: r.reviewed_by,
            review_comment: r.review_comment,
            userId: r.user_id,
            full_name: r.full_name
        };
    },

    async review(id: string, status: LeaveStatus, comment?: string): Promise<RequestOut> {
        const res = await axiosClient.patch<BackendRequest>(`/time-off-requests/${id}/review`, {
            status,
            comment,
        });
        const r = res.data;
        return {
            id: r.id,
            type: r.leave_type,
            date: `${r.start_date} - ${r.end_date}`,
            status: r.status,
            statusLabel: capitalize(r.status),
            reason: r.reason,
            reviewed_by: r.reviewed_by,
            review_comment: r.review_comment,
            userId: r.user_id,
            full_name: r.full_name
        };
    },
};
