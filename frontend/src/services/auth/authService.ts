import { axiosClient } from "../api/client";
import { endpoints } from "../api/endpoints";
import {
   
    LoginData,
    TokenResponse,
} from "./auth.types";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    sub: string;
    role: string;
    exp: number;
}

export const authService = {

    async login(data: LoginData): Promise<{ access_token: string; role: string }> {
        const formData = new FormData();
        formData.append("username", data.usernameOrEmail);
        formData.append("password", data.password);

        const response = await axiosClient.post<TokenResponse>(
            endpoints.auth.login,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        if (typeof window !== "undefined") {
            localStorage.setItem("access_token", response.data.access_token);
        }

        const decoded: DecodedToken = jwtDecode(response.data.access_token);
        return { access_token: response.data.access_token, role: decoded.role };
    },

    logout(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
        }
    },

    getToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("access_token");
    },

    getRole(): string | null {
        const token = this.getToken();
        if (!token) return null;
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.role;
    },
};
