import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const createFeedback = async (formData: FormData) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("Token not found");
    }

    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/order-feedback`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        }

    );
    return res.data;
};

export const useCreateFeedback = () => {
    return useMutation({
        mutationFn: createFeedback
    });
};
