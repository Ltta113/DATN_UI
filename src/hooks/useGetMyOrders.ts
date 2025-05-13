import { useQuery } from "@tanstack/react-query";
import { Feedback } from "app/component/Feedback/OrderFeedback";
import { OrderItem } from "app/context/OrderContent";
import axios from "axios";
import { ResponseData } from "types/responseData";

export interface Order {
  id: number;
  total_amount: string;
  status: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  payment_method: string;
  note: string;
  order_items_count: number;
  ward: string;
  district: string;
  province: string;
  order_items: OrderItem[];
  feedback: Feedback;
  order_code: string;
  created_at: string;
  updated_at: string;
}

const fetchGetMyOrders = async (): Promise<ResponseData> => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found in local storage");
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const useGetMyOrders = () => {
  return useQuery<ResponseData, Error>({
    queryKey: ["orderList"],
    queryFn: fetchGetMyOrders,
  });
};
