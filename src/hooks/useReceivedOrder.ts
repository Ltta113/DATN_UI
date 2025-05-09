import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const receivedOrder = async (orderId: string) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user/orders/${orderId}/receive`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const useReceivedOrder = () => {
  return useMutation({
    mutationFn: receivedOrder,
  });
};
