import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchDiscount = async (id: string): Promise<ResponseData> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/discounts/${id}`
  );
  return response.data;
};

export const useGetDiscount = (id: string) => {
  return useQuery<ResponseData, Error>({
    queryKey: ["discount", id],
    queryFn: () => fetchDiscount(id),
    enabled: !!id,
  });
};
