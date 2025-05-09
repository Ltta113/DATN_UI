"use client";

import { useDeposite } from "hooks/useDeposite";
import React, { useState } from "react";
import { FaCreditCard } from "react-icons/fa";

const PaymentSelector = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [error, setError] = useState<string>("");
  const { mutate: depositMutate, isPending } = useDeposite();

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000];

  const handleAmountSelect = (amount: number): void => {
    setSelectedAmount(amount);
    setIsCustomAmount(false);
  };

  const handleCustomAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value: string = e.target.value.replace(/\D/g, "");
    setCustomAmount(parseInt(value, 10));

    if (value) {
      setSelectedAmount(parseInt(value, 10));
    } else {
      setSelectedAmount(0);
    }
  };

  const enableCustomAmount = () => {
    setIsCustomAmount(true);
    setSelectedAmount(0);
    setCustomAmount(0);
  };

  const handleGetPaymentLink = async () => {
    setError("");

    if (selectedAmount < 10000 || selectedAmount > 1000000) {
      setError("Số tiền phải từ 10.000 đến 1.000.000 VNĐ");
      return;
    }

    depositMutate(selectedAmount);
  };

  const formatAmount = (amount: number | string): string => {
    if (!amount) return "0";
    return Number(amount).toLocaleString("vi-VN");
  };

  return (
    <div className="w-3/7 mx-auto bg-white p-6 rounded-lg shadow-md">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Nạp tiền vào tài khoản
        </h2>

        {/* Thông báo lỗi */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Thông báo: </strong>
            {error}
          </div>
        )}

        {/* Phần chọn mệnh giá */}
        <div className="mb-6">
          <span className="block text-gray-700 font-medium mb-3">
            Chọn số tiền nạp
          </span>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {predefinedAmounts.map((amount) => (
              <div
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`border rounded-md p-3 text-center cursor-pointer ${
                  selectedAmount === amount
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-300 hover:border-orange-300"
                }`}
              >
                {formatAmount(amount)} VNĐ
              </div>
            ))}
            <div
              onClick={enableCustomAmount}
              className={`border rounded-md p-3 text-center cursor-pointer ${
                isCustomAmount
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-300 hover:border-orange-300"
              }`}
            >
              Số khác
            </div>
          </div>

          {isCustomAmount && (
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={customAmount || ""}
                  onChange={handleCustomAmountChange}
                  placeholder="Nhập số tiền"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                />
                <span className="absolute right-3 top-3 text-gray-500">
                  VNĐ
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Số tiền tối thiểu: 10,000 VNĐ
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="payment-method"
            className="block text-gray-700 font-medium mb-3"
          >
            Phương thức thanh toán
          </label>

          <div className="space-y-3">
            <div className="border rounded-md p-3 flex items-center cursor-pointer">
              <div className="w-5 h-5 rounded-full border border-orange-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              </div>
              <div className="ml-3 flex-1" id="payment-method">
                <div className="font-medium flex items-center">
                  <FaCreditCard className="text-blue-600 mr-2" />
                  Thanh toán qua ZaloPay
                </div>
                <p className="text-sm text-gray-600">
                  Thanh toán trực tuyến bằng ZaloPay
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGetPaymentLink}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 cursor-pointer transition duration-200"
            disabled={isPending}
          >
            Nạp tiền
          </button>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <p>Chúng tôi chấp nhận thanh toán qua ZaloPay</p>
          <p>Vui lòng không cung cấp thông tin tài khoản cho bất kỳ ai.</p>
          <p>
            Chúng tôi không chịu trách nhiệm cho bất kỳ giao dịch nào không hợp
            lệ.
          </p>
        </div>
      </div>
    </div>
  );
};
export default PaymentSelector;
