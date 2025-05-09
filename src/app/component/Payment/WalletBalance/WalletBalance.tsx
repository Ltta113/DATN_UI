"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { User } from "app/context/AuthContext";
import PaymentSelector from "../PaymentSelector/PaymentSelector";
import { useGetProfile } from "hooks/useGetProfile";
import TransactionHistory from "app/component/Transaction/TransactionList/TransactionList";

export default function WalletBalance() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<"list" | "deposit">("list");
  const { data, isPending, refetch } = useGetProfile();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const status = searchParams?.get("status")
    ? parseInt(searchParams.get("status") || "0")
    : null;
  const amount = searchParams?.get("amount") || "0";
  const apptransid = searchParams?.get("apptransid") || "";
  const bankcode = searchParams?.get("bankcode") || "";

  const isSuccess = status === 1;
  const isCancelled = status !== null && status < 0;
  const isFailed =
    status === 0 || (status !== null && !isSuccess && !isCancelled);
  const hasTransaction = status !== null;

  useEffect(() => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("user");

      if (data) {
        setUser(data as User);
        localStorage.setItem("user", JSON.stringify(data));
      } else if (userData && !isPending) {
        setUser(JSON.parse(userData));
      } else if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  }, [data, isPending]);

  const formatCurrency = (amount: number | string): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Vui lòng đăng nhập để xem thông tin ví</p>
        <Link
          href="/login"
          className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white shadow-md rounded-lg pb-4">
      {/* Wallet balance card */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Số dư ví</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-3xl font-bold">
            {formatCurrency(user.wallet)}
          </span>
        </div>
        <div className="text-orange-100 text-sm mt-2 items-center justify-center">
          Cập nhật lúc: {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* Transaction result (if available) */}
      {hasTransaction && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center mb-3">
            {isSuccess && (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
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
            )}
            {isFailed && (
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
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
            )}
            {isCancelled && (
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-600"
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
            )}
            <h3 className="font-medium">
              {isSuccess
                ? "Nạp tiền thành công"
                : isCancelled
                ? "Giao dịch bị hủy"
                : "Nạp tiền thất bại"}
            </h3>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Số tiền:</span>
              <span className="font-medium">{formatCurrency(amount)}</span>
            </div>
            {apptransid && (
              <div className="flex justify-between">
                <span>Mã giao dịch:</span>
                <span className="font-medium">{apptransid}</span>
              </div>
            )}
            {bankcode && (
              <div className="flex justify-between">
                <span>Ngân hàng:</span>
                <span className="font-medium">{bankcode}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setOpen("deposit")}
            className="bg-orange-50 cursor-pointer hover:bg-orange-100 text-orange-700 p-3 rounded-md text-center transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-sm font-medium">Nạp tiền</span>
          </button>
          <button
            onClick={() => setOpen("list")}
            className="bg-green-50 cursor-pointer hover:bg-green-100 text-green-700 p-3 rounded-md text-center transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-sm font-medium">Lịch sử</span>
          </button>
        </div>
      </div>

      {open === "list" && (
        <div className="p-4 border-t border-gray-100">
          <h3 className="font-medium text-gray-700 mb-3">Giao dịch gần đây</h3>
          <div className="text-center py-6 text-gray-500 text-sm">
            <TransactionHistory />
          </div>
        </div>
      )}
      {open === "deposit" && (
        <div className="p-4 border-t border-gray-100">
          <h3 className="font-medium text-gray-700 mb-3">Nạp tiền vào ví</h3>
          <div className="text-gray-500 text-sm">
            <PaymentSelector />
          </div>
        </div>
      )}
    </div>
  );
}
