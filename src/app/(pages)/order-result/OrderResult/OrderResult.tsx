"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function PaymentResult() {
  const searchParams = useSearchParams();
  const [paymentData] = useState({
    status: searchParams?.get("status") || "",
    amount: searchParams?.get("amount") || "0",
    apptransid: searchParams?.get("apptransid") || "unknown",
    bankcode: searchParams?.get("bankcode") || "",
  });

  // Determine payment status
  const status = parseInt(paymentData.status);
  const isSuccess = status === 1;
  const isCancelled = status < 0;
  const isFailed = status === 0 || (!isSuccess && !isCancelled);

  // Format currency to VND
const formatCurrency = (amount: number | string): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(amount));
};

  // Get background color based on status
  const getBgColor = () => {
    if (isSuccess) return "bg-green-50";
    if (isCancelled) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${getBgColor()} text-center p-4`}
    >
      {isSuccess && (
        <>
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Thanh toán thành công
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mb-6">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-gray-500 text-sm">Mã giao dịch</p>
              <p className="font-semibold">{paymentData.apptransid}</p>
            </div>
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-gray-500 text-sm">Ngân hàng</p>
              <p className="font-semibold">
                {paymentData.bankcode || "Không có"}
              </p>
            </div>
            <div className="mb-2">
              <p className="text-gray-500 text-sm">Số tiền</p>
              <p className="font-bold text-xl text-green-600">
                {formatCurrency(paymentData.amount)}
              </p>
            </div>
          </div>
        </>
      )}

      {isFailed && (
        <>
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Thanh toán thất bại
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mb-6">
            <p className="text-lg text-gray-700 mb-4">
              Giao dịch <strong>{paymentData.apptransid}</strong> không thành
              công.
            </p>
            <p className="text-gray-600 mb-2">
              Vui lòng kiểm tra lại thông tin thanh toán hoặc thử lại sau.
            </p>
          </div>
        </>
      )}

      {isCancelled && (
        <>
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-yellow-100 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">
            Thanh toán đã bị hủy
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mb-6">
            <p className="text-lg text-gray-700 mb-4">
              Đơn hàng <strong>{paymentData.apptransid}</strong> chưa được thanh
              toán.
            </p>
            <p className="text-gray-600 mb-2">
              Bạn có thể thử lại thanh toán bất cứ lúc nào từ trang đơn hàng.
            </p>
          </div>
        </>
      )}

      <div className="flex gap-4 mt-4">
        <Link
          href="/orders"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Xem danh sách đơn hàng
        </Link>
        <Link
          href="/"
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
