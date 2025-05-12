import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchListDiscounts = async (page: number, limit: number): Promise<ResponseData> => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("No access token found");
    }

    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/discounts/list?page=${page}&limit=${limit}`
    );
    return response.data.data;

};

export const useDiscountsWithoutBooks = (page: number, limit: number) => {
    return useQuery<ResponseData>({
        queryKey: ["discountsWithoutBooks", page, limit],
        queryFn: () => fetchListDiscounts(page, limit),
        staleTime: 1000 * 60 * 5,
    });
};
