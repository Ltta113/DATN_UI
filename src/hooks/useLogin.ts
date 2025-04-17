import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoginCredentials, RegisterResponse } from "../types/auth";
import { AxiosError } from "../types/axios";

const loginUser = async (
  credentials: LoginCredentials
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useLogin = () => {
  return useMutation<RegisterResponse, AxiosError, LoginCredentials>({
    mutationFn: loginUser,
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};
