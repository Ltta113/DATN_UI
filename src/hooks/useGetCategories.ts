import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchCategories = async (): Promise<ResponseData> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  return response.data;
};

export const useGetCategories = () => {
  return useQuery<ResponseData>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
