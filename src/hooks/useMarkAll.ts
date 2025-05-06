import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const markAllAsRead = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }

  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/notifications/mark-all-as-read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const useMarkAllAsRead = () => {
  return useMutation({
    mutationFn: markAllAsRead,
  });
};
