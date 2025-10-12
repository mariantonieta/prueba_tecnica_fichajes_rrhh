import axios, { AxiosRequestConfig, AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getToken = (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

export const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const message =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Error desconocido";
        return Promise.reject(new Error(message));
    }
);
