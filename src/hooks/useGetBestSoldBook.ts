import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchBestSoldBooks = async (page: number, limit: number = 10): Promise<ResponseData> => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/books/best-sold?page=${page}&limit=${limit}`,
    );
    return response.data;

};

export const useBestSoldBooks = (page: number = 1, limit: number = 10) => {
    return useQuery<ResponseData>({
        queryKey: ["bestSoldBooks", page, limit],
        queryFn: () => fetchBestSoldBooks(page, limit),
        staleTime: 1000 * 60 * 5,
    });
};
