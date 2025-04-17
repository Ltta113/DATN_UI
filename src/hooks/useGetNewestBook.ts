import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchNewestBooks = async (): Promise<ResponseData> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/books`);
  return response.data;
};

export const useNewestBooks = () => {
  return useQuery<ResponseData>({
    queryKey: ["newestBooks"],
    queryFn: fetchNewestBooks,
  });
};
