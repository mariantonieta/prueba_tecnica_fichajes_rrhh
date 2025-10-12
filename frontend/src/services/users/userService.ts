import { axiosClient } from "../api/client"
import { UserOut, UserUpdate } from "./userTypes"

export const userService = {
async updateUser(userId: string, data: UserUpdate): Promise<UserOut> {
    const response = await axiosClient.patch(`/users/${userId}`, data);
    return response.data; 
},


    async deleteUser(userId: string): Promise<{ message: string }> {
        const response = await axiosClient.delete(`/users/${userId}`)
        return response.data
    },

    async getUser(userId: string): Promise<UserOut> {
        const response = await axiosClient.get(`/users/${userId}`)
        return response.data
    },
    async getCurrentUser(): Promise<UserOut> {
        const response = await axiosClient.get(`/users/me`)
        return response.data
    },
    async getAllEmployees(): Promise<UserOut[]> {
        const res = await axiosClient.get("/users/");
        return res.data;
    },
    async searchEmployees(query: string): Promise<UserOut[]> {
        const res = await axiosClient.get("/users/search", {
            params: { query }
        });
        return res.data;
    }
}
