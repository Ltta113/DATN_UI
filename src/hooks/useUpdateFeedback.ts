import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const updateFeedback = async ({ formData, id }: { formData: FormData; id: string }) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("Token not found");
    }

    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/order-feedback/${id}`,
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

export const useUpdateFeedback = () => {
    return useMutation({
        mutationFn: updateFeedback
    });
};
