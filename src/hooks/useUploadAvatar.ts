import { useMutation } from "@tanstack/react-query";
import { useAuth, User } from "app/context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

export const useUploadAvatar = () => {
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("avatar", file);

            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        },
        onSuccess: (data) => {
            setUser(data.data as User)
            localStorage.setItem("user", JSON.stringify(data.data));
            toast.success("Cập nhật ảnh đại diện thành công!");
        },
        onError: () => {
            toast.error("Cập nhật ảnh thất bại!");
        },
    });
};
