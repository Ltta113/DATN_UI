import { User } from "app/context/AuthContext";

export interface RegisterCredentials {
  email: string;
  password: string;
  password_confirmation: string;
  full_name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user?: User;
  token?: string;
  message?: string;
}
