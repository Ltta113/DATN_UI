import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Combo } from "app/component/Payment/OrderSummery/OrderSummery";
import { ResponseData } from "types/responseData";

const fetchCombos = async (
  page: number,
  limit: number = 10
): Promise<ResponseData<Combo[]>> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/combos?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const useGetCombos = (page: number = 1, limit: number = 10) => {
  return useQuery<ResponseData<Combo[]>>({
    queryKey: ["combos", page, limit],
    queryFn: () => fetchCombos(page, limit),
    staleTime: 1000 * 60 * 5,
  });
};
