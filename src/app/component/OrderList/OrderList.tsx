"use client";

import { Order, useGetMyOrders } from "hooks/useGetMyOrders";
import React from "react";
import {
  FiShoppingBag,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiUser,
  FiDollarSign,
} from "react-icons/fi";
import Loading from "../Loading/Loading";

export default function UserOrderList() {
  const { data, isPending } = useGetMyOrders();

  const orders = (data as Order[]) || [];

  console.log("order", data);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "paid":
        return "Đã thanh toán";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodTranslation = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      case "credit_card":
        return "Thẻ tín dụng";
      case "momo":
        return "Ví MoMo";
      case "payos":
        return "PayOS";
      default:
        return method;
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Đơn Hàng Của Tôi</h1>
      {isPending && <Loading />}

      {!isPending && orders.length === 0 ? (
        <div className="text-center py-8">
          <FiShoppingBag className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Mã đơn: #{order.id}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                    order.status
                  )}`}
                >
                  {getStatusTranslation(order.status)}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-start">
                  <FiCalendar className="text-gray-500 mt-1 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                    <p className="text-sm font-medium">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiDollarSign className="text-gray-500 mt-1 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Tổng thanh toán</p>
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(order.total_amount))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiShoppingBag className="text-gray-500 mt-1 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Số lượng sản phẩm</p>
                    <p className="text-sm font-medium">
                      {order.order_items_count}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiUser className="text-gray-500 mt-1 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Người nhận</p>
                    <p className="text-sm font-medium">{order.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMapPin className="text-gray-500 mt-1 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="text-sm font-medium text-ellipsis overflow-hidden">
                      {order.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiPhone className="text-gray-500 mt-1 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="text-sm font-medium">{order.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiClock className="text-gray-500 mt-1 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Phương thức thanh toán
                    </p>
                    <p className="text-sm font-medium">
                      {getPaymentMethodTranslation(order.payment_method)}
                    </p>
                  </div>
                </div>

                {order.note && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Ghi chú:</p>
                    <p className="text-sm">{order.note}</p>
                  </div>
                )}
              </div>

              <button className="w-full cursor-pointer text-center mt-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition">
                Xem Chi Tiết
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
          Xem Thêm
        </button>
      </div>
    </div>
  );
}
