import { ResponseData } from "types/responseData";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchNewestBooks = async (
  page: number,
  limit: number = 10,
  min: number = 0,
  max: number = 2500000
): Promise<ResponseData> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/books?page=${page}&limit=${limit}&min=${min}&max=${max}`
  );
  return response.data;
};

export const useNewestBooks = (
  page: number = 1,
  limit: number = 10,
  min: number = 0,
  max: number = 2500000
) => {
  return useQuery<ResponseData>({
    queryKey: ["newestBooks", page, limit, min, max],
    queryFn: () => fetchNewestBooks(page, limit, min, max),
    staleTime: 1000 * 60 * 5,
  });
};
