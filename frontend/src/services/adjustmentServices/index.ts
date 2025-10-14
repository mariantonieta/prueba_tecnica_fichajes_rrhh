import { axiosClient } from "../api/client";

export enum AdjustmentTypeEnum {
    ENTRY_CORRECTION = "ENTRY_CORRECTION",
    EXIT_CORRECTION = "EXIT_CORRECTION",
    MANUAL_ENTRY = "MANUAL_ENTRY",
    OTHER = "OTHER",
}

export enum AdjustmentStatusEnum {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export interface TimeAdjustmentCreate {
    time_record_id: string;
    adjusted_timestamp: string;
    adjusted_type: AdjustmentTypeEnum;
    reason: string;
}

export const adjustmentService = {
    async create(data: TimeAdjustmentCreate) {
        const res = await axiosClient.post("/time-adjustments/", data);
        return res.data;
    },

    async getAll() {
        const res = await axiosClient.get("/time-adjustments/");
        return res.data;
    },
    async updateStatus(id: string, status: AdjustmentStatusEnum, comment?: string) {
        const res = await axiosClient.put(`/time-adjustments/${id}/review`, null, {
            params: {
                new_status: status,
                review_comment: comment,
            },
        });
        return res.data;
    },
};
