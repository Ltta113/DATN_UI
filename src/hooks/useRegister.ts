import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { RegisterCredentials, RegisterResponse } from "../types/auth";
import { AxiosError } from "../types/axios";

const registerUser = async (
  credentials: RegisterCredentials
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useRegister = () => {
  return useMutation<RegisterResponse, AxiosError, RegisterCredentials>({
    mutationFn: registerUser,
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
};
