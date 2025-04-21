import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "../types/axios";

export interface OrderRequest {
    order_items: Array<{
        book_id: number;
        quantity: number;
    }>;
}

export interface OrderResponse {
    message: string;
    order: any;
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

export const useCreateOrder = () => {
    return useMutation<OrderResponse, AxiosError, OrderRequest>({
        mutationFn: placeOrder,
    });
};
