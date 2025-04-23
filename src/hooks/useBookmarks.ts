import { useMutation } from "@tanstack/react-query";
import { useAuth } from "app/context/AuthContext";
import { Book } from "app/lib/books";
import axios from "axios";
import { toast } from "react-toastify";

export const bookmarks = async (bookId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("No access token found in local storage");
    }
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/bookmark`, {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}

export const useBookmark = () => {

    const { setUser, user } = useAuth();

    return useMutation({
        mutationFn: bookmarks,
        onSuccess: (data) => {
            toast.success(data.message);
            if (user) {
                user.bookmarks = data.data.books as Book[];
            }
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
        },
    });
};