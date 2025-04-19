import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchGetAuthor = async (page: number): Promise<ResponseData> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/authors?page=${page}`
  );
  return response.data;
};

export const useGetAuthor = (page: number) => {
  return useQuery<ResponseData>({
    queryKey: ["listAuthor"],
    queryFn: () => fetchGetAuthor(page),
  });
};
