import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type DestroyReviewParams = {
  reviewable_type: "book" | "author" | "order";
  reviewable_id: number;
};

const destroyReview = async (params: DestroyReviewParams) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }

  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/user/reviews`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: params,
    }
  );

  return response.data;
};

export const useDestroyReview = () => {
  return useMutation({
    mutationFn: destroyReview,
  });
};
