import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Combo } from "app/component/Payment/OrderSummery/OrderSummery";
import { ResponseData } from "types/responseData";

const fetchComboBySlug = async (slug: string): Promise<ResponseData<Combo>> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/combos/${slug}`
  );
  return response.data;
};

export const useGetComboBySlug = (slug: string) => {
  return useQuery<ResponseData<Combo>>({
    queryKey: ["combo", slug],
    queryFn: () => fetchComboBySlug(slug),
    staleTime: 1000 * 60 * 5,
  });
}; 