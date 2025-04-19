import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchGetAuthorBySlug = async (slug: string, page?: number): Promise<ResponseData> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/authors/${slug}?page=${page}`,
  );
  return response.data;
};

export const useGetAuthorBySlug = (slug: string, page?: number) => {
  return useQuery<ResponseData>({
    queryKey: ["author", slug],
    queryFn: () => fetchGetAuthorBySlug(slug, page),
  });
};
