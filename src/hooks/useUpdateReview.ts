import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type ReviewData = {
  id: number;
  reviewable_type: "book" | "author" | "order" | "combo";
  reviewable_id: number;
  content: string;
  rating: number;
};

const updateReview = async (data: ReviewData) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }

  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/user/reviews/${data.id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useUpdateReview = () => {
  return useMutation({
    mutationFn: updateReview,
  });
};
