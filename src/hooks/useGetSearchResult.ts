import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useSearchResult(
  query: string,
  category: string,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: ["search", query, category, page, limit],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/books/search?name=${query}&category=${category}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!query.trim() || !!category,
  });
}
