"use client";

import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEye,
  faEyeSlash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useLogin } from "hooks/useLogin";
import { GoogleButton } from "app/component/Auth/GoogleButton";
import { FacebookButton } from "app/component/Auth/FacebookButton";
import { RegisterResponse } from "types/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();
  const loginMutation = useLogin();
  const { login } = useAuth();

  const validateForm = () => {
    const validationErrors: { [key: string]: string } = {};

    // Validate email
    if (!email) {
      validationErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!password) {
      validationErrors.password = "Mật khẩu là bắt buộc";
    }

    return validationErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    loginMutation.mutate(
      {
        email: email,
        password: password,
      },
      {
        onSuccess: (data: RegisterResponse) => {
          // Lưu token vào localStorage
          localStorage.setItem("access_token", data.token ?? "");
          if (data?.user) {
            login(data.user);
          } else {
            toast.error("Không tìm thấy thông tin người dùng.");
          }
          toast.success("Đăng nhập thành công");
          router.push("/");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
              "Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu."
          );
        },
      }
    );
  };

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div
      className="flex min-h-screen bg-gray-300 bg-opacity-60 relative bg-left-top"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dswj1rtvu/image/upload/v1744021608/BookStore/picture_fwmwiy.png')",
      }}
    >
      <div className="hidden lg:flex lg:w-6/8 relative p-8 items-center justify-center">
        <div className="relative z-10 w-full h-full flex flex-col items-center text-left p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-relaxed">
            Chào mừng trở lại với thư viện sách điện tử
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            Nơi bạn có thể khám phá và mua những cuốn sách yêu thích
          </p>
          <p className="text-lg text-gray-600">
            Đăng nhập để tiếp tục hành trình khám phá tri thức
          </p>

          <div className="mt-8 relative w-2/8"></div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-3/7 bg-white rounded-l-3xl flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto w-full">
          {/* Close button */}
          <div className="text-left mb-6">
            <button
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
              onClick={handleClick}
            >
              <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
            </button>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Đăng nhập tài khoản
            </h2>
          </div>

          {/* Show loading or error state */}
          {loginMutation.isPending && (
            <div className="mb-4 p-2 text-center text-blue-600 bg-blue-50 rounded">
              Đang xử lý đăng nhập...
            </div>
          )}

          {loginMutation.isError && (
            <div className="mb-4 p-2 text-center text-red-600 bg-red-50 rounded">
              {loginMutation.error?.response?.data?.message ||
                "Đăng nhập thất bại. Vui lòng thử lại."}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 text-left mb-1"
              >
                Địa chỉ email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-left pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="h-5 w-5 text-gray-400"
                  />
                </button>
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 text-left mb-1"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-left pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="h-5 w-5 text-gray-400"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faEye}
                      className="h-5 w-5 text-gray-400"
                    />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-yellow-600 text-sm">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="z-20 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 cursor-pointer"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {/* Alternative login methods */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Đăng nhập bằng cách khác
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <GoogleButton />
              <FacebookButton />
            </div>
          </div>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <span className="text-gray-600">Chưa có tài khoản? &nbsp;</span>
            <Link href="/signup" className="text-yellow-600 font-bold mr-1">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
