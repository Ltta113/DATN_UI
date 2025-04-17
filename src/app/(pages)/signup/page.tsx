"use client";

import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEye,
  faEyeSlash,
  faXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useRegister } from "hooks/useRegister";
import { GoogleButton } from "app/component/Auth/GoogleButton";
import { FacebookButton } from "app/component/Auth/FacebookButton";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();
  const registerMutation = useRegister();

  const validateForm = () => {
    const validationErrors: { [key: string]: string } = {};

    // Validate name
    if (name && name.length > 255) {
      validationErrors.name = "Họ và tên không được vượt quá 255 ký tự";
    }

    // Validate email
    if (!email) {
      validationErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email không hợp lệ";
    } else if (email.length > 255) {
      validationErrors.email = "Email không được vượt quá 255 ký tự";
    }

    // Validate password
    if (!password) {
      validationErrors.password = "Mật khẩu là bắt buộc";
    } else if (password.length < 8) {
      validationErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    // Validate confirm password
    if (confirmPassword !== password) {
      validationErrors.confirmPassword = "Mật khẩu không khớp";
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

    registerMutation.mutate(
      {
        full_name: name,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success("Đăng ký thành công");
          router.push("/login");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
              "Đăng ký không thành công. Vui lòng thử lại."
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
        <div className="relative z-10 w-full h-full flex flex-col items-center text-right p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-relaxed">
            Chào mừng bạn đến với thư viện sách điện tử
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            Nơi bạn có thể khám phá và mua những cuốn sách yêu thích
          </p>
          <p className="text-lg text-gray-600">
            Đăng ký ngay hôm nay để bắt đầu hành trình khám phá tri thức
          </p>

          <div className="mt-8 relative w-2/8"></div>
        </div>
      </div>

      {/* Right side with signup form */}
      <div className="w-full lg:w-3/7 bg-white rounded-l-3xl flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto w-full">
          {/* Close button */}
          <div className="text-right mb-6">
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
              Đăng ký tài khoản
            </h2>
          </div>

          {/* Show loading or error state */}
          {registerMutation.isPending && (
            <div className="mb-4 p-2 text-center text-blue-600 bg-blue-50 rounded">
              Đăng ký đang được xử lý...
            </div>
          )}

          {registerMutation.isError && (
            <div className="mb-4 p-2 text-center text-red-600 bg-red-50 rounded">
              {registerMutation.error?.response?.data?.message ||
                "Đăng ký không thành công. Vui lòng thử lại."}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 text-right mb-1"
              >
                Họ và tên
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-right"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="h-5 w-5 text-gray-400"
                  />
                </button>
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 text-right mb-1"
              >
                Địa chỉ email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-right"
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
                className="block text-sm font-medium text-gray-700 text-right mb-1"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-right"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 text-right mb-1"
              >
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-right"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="z-20 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 cursor-pointer"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          {/* Alternative signup methods */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Đăng ký bằng cách khác
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <GoogleButton />
              <FacebookButton />
            </div>
          </div>

          {/* Login link */}
          <div className="mt-8 text-center">
            <span className="text-gray-600">Đã có tài khoản? &nbsp;</span>
            <Link href="/login" className="text-yellow-600 font-bold mr-1">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
