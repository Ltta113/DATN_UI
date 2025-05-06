import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "../types/axios";
import { Order } from "app/context/OrderContent";

export interface OrderCreateRequest {
  name: string;
  phone: string;
  address: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  payment_method: string;
  note?: string;
  order_items: Array<{
    book_id: number;
    quantity: number;
  }>;
}

export interface OrderResponse {
  message: string;
  data: Order;
  checkoutUrl?: string;
}

export interface OrderErrors {
  message: string;
  errors: {
    name?: string[];
    phone?: string[];
    address?: string[];
    email?: string[];
    payment_method?: string[];
    note?: string[];
    [key: string]: string[] | undefined;
  };
}

const placeOrder = async (
  orderData: OrderCreateRequest
): Promise<OrderResponse> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token not found");
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/orders/create`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useCreateOrder = () => {
  return useMutation<
    OrderResponse,
    AxiosError<OrderErrors>,
    OrderCreateRequest
  >({
    mutationFn: placeOrder,
  });
};
