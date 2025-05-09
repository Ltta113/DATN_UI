import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchBookBySlug = async (slug: string): Promise<ResponseData> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/books/${slug}`
  );
  return response.data;
};

export const useGetBook = (slug: string) => {
  return useQuery<ResponseData, Error>({
    queryKey: ["book", slug],
    queryFn: () => fetchBookBySlug(slug),
    enabled: !!slug,
  });
};
