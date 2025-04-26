import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useSearchResult(
  query: string,
  category: string,
  page: number = 1,
  limit: number = 10,
  min: number = 0,
  max: number = 2500000
) {
  return useQuery({
    queryKey: ["search", query, category, page, limit, min, max],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/books/search?name=${query}&category=${category}&page=${page}&limit=${limit}&min=${min}&max=${max}`
      );
      return res.data;
    },
    enabled: !!query.trim() || !!category,
  });
}
