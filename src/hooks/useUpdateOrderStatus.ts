import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const updateOrderStatus = async (orderId: string) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user/orders/update-status`,
    {
      orderCode: orderId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: updateOrderStatus,
  });
};
