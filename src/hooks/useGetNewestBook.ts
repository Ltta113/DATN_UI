import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchNewestBooks = async (page: number, limit: number = 10): Promise<ResponseData> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/books?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const useNewestBooks = (page: number = 1, limit: number = 10) => {
  return useQuery<ResponseData>({
    queryKey: ["newestBooks"],
    queryFn: () => fetchNewestBooks(page, limit),
  });
};
