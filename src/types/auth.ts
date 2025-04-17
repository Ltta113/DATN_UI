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
  user?: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    last_login: string;
    avatar: string;
  };
  token?: string;
  message?: string;
}
