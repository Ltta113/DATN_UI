import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchNewestBooks = async (page: number): Promise<ResponseData> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/books?page=${page}`
  );
  return response.data;
};

export const useNewestBooks = (page: number = 1) => {
  return useQuery<ResponseData>({
    queryKey: ["newestBooks"],
    queryFn: () => fetchNewestBooks(page),
  });
};
