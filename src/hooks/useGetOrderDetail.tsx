import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchOrderDetail = async (id: string): Promise<ResponseData> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found in local storage");
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const useGetOrderDetail = (id: string) => {
  return useQuery<ResponseData, Error>({
    queryKey: ["order", id],
    queryFn: () => fetchOrderDetail(id),
    enabled: !!id,
  });
};
