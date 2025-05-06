"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BiCheck, BiHomeAlt, BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import CustomerInfoForm, {
  CustomerInfo,
} from "app/component/Payment/CustomerForm/CustomerForm";
import PaymentMethodSelector from "app/component/Payment/PaymentMethod/PaymentMenthodSeleter";
import { OrderItem, useOrder } from "app/context/OrderContent";
import {
  OrderCreateRequest,
  OrderErrors,
  useCreateOrder,
} from "hooks/useCreateOrder";
import { toast } from "react-toastify";

export default function OrderConfirmationPage() {
  const { order: orderData, setOrderData } = useOrder();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [errorData, setErrorData] = useState<OrderErrors>({
    message: "",
    errors: {},
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    notes: "",
    province: "",
    district: "",
    ward: "",
  });

  const { mutate: createOrder } = useCreateOrder();

  if (!orderData || !orderData.order_items) {
    return (
      <div className="text-center py-20 text-gray-500">
        Không có đơn hàng nào để hiển thị.
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleProcessOrder = async () => {
    setIsProcessing(true);

    const orderDataToSubmit: OrderCreateRequest = {
      ...orderData,
      payment_method: paymentMethod,
      name: customerInfo.full_name,
      email: customerInfo.email,
      phone: customerInfo.phone_number,
      address: customerInfo.address,
      note: customerInfo.notes,
      province: customerInfo.province || "",
      district: customerInfo.district || "",
      ward: customerInfo.ward || "",
    };
    console.log("paymentMethod", paymentMethod);
    createOrder(orderDataToSubmit, {
      onSuccess: (data) => {
        setOrderData(data.data);
        setIsProcessing(false);
        toast.success("Đặt hàng thành công!");
        if (paymentMethod === "zalopay") {
          window.location.href = data.checkoutUrl ?? "/";
        } else {
          window.location.href = `${window.location.origin}/order-result?status=1&amount=${data.data.total_amount}&apptransid=${data.data.order_code}&bankcode=0`;
        }
      },
      onError: (data) => {
        setIsProcessing(false);

        setErrorData(data?.response?.data as OrderErrors);
        toast.error("eweqeqwe");
        toast.error(data?.response?.data.message);
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-orange-500 flex items-center"
          >
            <BiHomeAlt className="mr-2" />
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/cart" className="text-gray-600 hover:text-orange-500">
            Giỏ hàng
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Xác nhận đơn hàng</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chi tiết đơn hàng */}
          <div className="lg:w-7/12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <span className="bg-orange-100 text-orange-600 p-1 rounded-full mr-2">
                    <BiCheck />
                  </span>
                  Chi tiết đơn hàng
                </h2>
              </div>

              <div className="p-4">
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Ngày đặt hàng: {formatDate(orderData.created_at)}</span>
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium uppercase">
                    {orderData.status === "pending"
                      ? "Chờ thanh toán"
                      : orderData.status}
                  </span>
                </div>

                <div className="divide-y divide-gray-200">
                  {orderData.order_items.map((item: OrderItem) => (
                    <div key={item.id} className="py-4 flex">
                      <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.book_image}
                          alt={item.book_name}
                          width={80}
                          height={96}
                          className="object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.book_name}
                        </h3>

                        <div className="flex justify-between items-end mt-2 text-sm">
                          <div>
                            <span className="text-gray-600">Đơn giá: </span>
                            <span className="font-medium">
                              {formatPrice(Number(item.price))}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Số lượng: </span>
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="font-medium text-orange-600">
                              {formatPrice(Number(item.price) * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatPrice(orderData.total_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                    <span>Tổng cộng:</span>
                    <span className="text-orange-600">
                      {formatPrice(orderData.total_amount || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/cart"
                className="text-orange-500 hover:text-orange-600 flex items-center justify-end"
              >
                <BiArrowBack className="mr-2" />
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">
                  Thông tin thanh toán
                </h2>
              </div>

              <div className="p-6">
                <CustomerInfoForm
                  customerInfo={customerInfo}
                  setCustomerInfo={setCustomerInfo}
                  errors={errorData}
                />

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    Phương thức thanh toán
                  </h3>
                  <PaymentMethodSelector
                    selected={paymentMethod}
                    onChange={setPaymentMethod}
                  />
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleProcessOrder}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                      isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291..."
                          />
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      "Thanh toán"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
