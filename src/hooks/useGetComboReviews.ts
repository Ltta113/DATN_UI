import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

interface Review {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

export const useGetComboReviews = (comboId: number, page: number = 1) => {
  const fetchComboReviews = async () => {
    const response = await axios.get<ResponseData<Review[]>>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/combos/${comboId}/reviews?page=${page}`
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["combo-reviews", comboId, page],
    queryFn: fetchComboReviews,
  });
}; 