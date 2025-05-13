import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const deleteFeedback = async ({ id }: { id: string }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }

  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/user/order-feedback/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const useDeleteFeedback = () => {
  return useMutation({
    mutationFn: deleteFeedback,
  });
};
