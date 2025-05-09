import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NotificationData, Notification } from "types/responseData";

const fetchListNotification = async (
  page: number,
  limit: number = 10
): Promise<NotificationData<Notification>> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/notifications?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useListNotification = (page: number = 1, limit: number = 10) => {
  return useQuery<NotificationData<Notification>>({
    queryKey: ["listNotification", page, limit],
    queryFn: () => fetchListNotification(page, limit),
    staleTime: 1000 * 60 * 5,
  });
};
