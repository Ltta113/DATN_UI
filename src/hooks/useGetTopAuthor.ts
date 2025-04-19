import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ResponseData } from "types/responseData";

const fetchTopAuthor = async (): Promise<ResponseData> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/authors/top`
  );
  return response.data;
};

export const useTopAuthor = () => {
  return useQuery<ResponseData>({
    queryKey: ["topAuthor"],
    queryFn: fetchTopAuthor,
  });
};
