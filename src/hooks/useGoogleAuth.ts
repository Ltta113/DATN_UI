import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useGoogleAuth = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`
      );

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }

      return response.data;
    },
    onError: (error) => {
      console.error("Lỗi khi xác thực Google:", error);
    },
  });
};
