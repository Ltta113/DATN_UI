import { useQuery } from "@tanstack/react-query";
import { Book } from 'app/lib/books';
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface User {
    email: string;
    full_name: string;
    phone_number: string;
    address: string;
    birth_day: string;
    province: string;
    district: string;
    ward: string;
    wallet: number;
    bookmarks: Book[];
}

export const useGetProfile = () => {
    return useQuery<User | null>({
        queryKey: ["profile"],
        queryFn: async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) return null;

                const res = await api.get("/user/profile");
                return res.data.data as User;
            } catch (err) {
                console.error("Lỗi khi lấy profile:", err);
                return null;
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};