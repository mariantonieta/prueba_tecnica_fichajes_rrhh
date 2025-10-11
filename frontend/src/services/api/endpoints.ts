export const endpoints = {
    auth: {
        register: "/auth/register",
        login: "/auth/login",
    },
    users: {
        update: (id: string) => `/users/${id}`,
        delete: (id: string) => `/users/${id}`,
    },
}
