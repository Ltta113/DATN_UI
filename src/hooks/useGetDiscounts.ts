import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchListDiscounts = async (): Promise<ResponseData> => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("No access token found");
    }

    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/discounts`
    );
    return response.data.data;

};

export const useListDiscounts = () => {
    return useQuery<ResponseData>({
        queryKey: ["listDiscounts"],
        queryFn: () => fetchListDiscounts(),
        staleTime: 1000 * 60 * 5,
    });
};
