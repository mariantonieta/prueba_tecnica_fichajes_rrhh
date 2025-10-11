import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})


axiosClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Error en la solicitud"
        return Promise.reject(new Error(message))
    }
)