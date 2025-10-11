import { axiosClient } from "../api/client"
import { UserOut, UserUpdate } from "./userTypes"

export const userService = {
    async updateUser(userId: string, data: UserUpdate): Promise<{ message: string }> {
        const response = await axiosClient.put(`/users/${userId}`, data)
        return response.data
    },

    async deleteUser(userId: string): Promise<{ message: string }> {
        const response = await axiosClient.delete(`/users/${userId}`)
        return response.data
    },

    async getUser(userId: string): Promise<UserOut> {
        const response = await axiosClient.get(`/users/${userId}`)
        return response.data
    },
}
