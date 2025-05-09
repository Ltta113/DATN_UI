import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

type DepositResponse = {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  zp_trans_token: string;
  order_url: string;
  order_token: string;
};

export const deposit = async (amount: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found in local storage");
  }
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user/transactions/deposit`,
    {
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useDeposite = () => {
  return useMutation({
    mutationFn: deposit,
    onSuccess: (data: DepositResponse) => {
      toast.success(data.return_message);
      if (data.return_code === 1) {
        window.location.href = data.order_url;
      } else {
        toast.error(data.sub_return_message);
      }
    }
  });
};
