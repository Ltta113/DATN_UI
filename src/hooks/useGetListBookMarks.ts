import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchListBookMarks = async (page: number, limit: number = 10): Promise<ResponseData> => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("No access token found");
    }

    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/bookmarks?page=${page}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    );
    return response.data;

};

export const useListBookMarks = (page: number = 1, limit: number = 10) => {
    return useQuery<ResponseData>({
        queryKey: ["listBookMarks", page, limit],
        queryFn: () => fetchListBookMarks(page, limit),
        staleTime: 1000 * 60 * 5,
    });
};
