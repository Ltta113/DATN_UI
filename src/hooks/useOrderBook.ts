import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "../types/axios";
import { Order } from "app/context/OrderContent";

export interface OrderRequest {
    order_items: Array<{
        orderable_id: number;
        orderable_type: string;
        quantity: number;
    }>;
}

export interface OrderResponse {
    message: string;
    order: Order;
}

const placeOrder = async (
    orderData: OrderRequest
): Promise<OrderResponse> => {
    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            throw new Error("Token not found");
        }
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user/orders`,
            orderData, {
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

export const useCheckOrder = () => {
    return useMutation<OrderResponse, AxiosError, OrderRequest>({
        mutationFn: placeOrder,
    });
};
