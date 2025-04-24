// hooks/useUpdateUserProfile.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "app/context/AuthContext";
import { toast } from "react-toastify";
import { User } from "app/component/UserProfileForm/UserFrofileForm";

export const useUpdateUserProfile = () => {
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (data: User) => {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (response) => {
      const $user = response.data;
      setUser($user);
      localStorage.setItem("user", JSON.stringify($user));
      toast.success("Cập nhật thông tin thành công!");
    },
    onError: (error: import("axios").AxiosError) => {
      const message =
        error.response?.status === 422
          ? Object.values((error.response?.data as { errors?: Record<string, string[]> })?.errors || {})
            .flat()
            .join("\n")
          : "Đã xảy ra lỗi. Vui lòng thử lại.";
      toast.error(message);
    },
  });
};
