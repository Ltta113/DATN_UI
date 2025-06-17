/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import OrderFeedback from "app/component/Feedback/OrderFeedback";
import { useCancelOrder } from "hooks/useCancelOrder";
import { Order } from "hooks/useGetMyOrders";
import { useGetOrderDetail } from "hooks/useGetOrderDetail";
import { useReceivedOrder } from "hooks/useReceivedOrder";
import { useRefundOrder } from "hooks/useRefundOrder";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FiShoppingBag,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiUser,
  FiDollarSign,
  FiMail,
  FiPackage,
  //   FiStar,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";

export default function OrderDetail() {
  const params = useParams();
  const router = useRouter();

  const orderId = params?.id as string;
  const { data, isPending, refetch } = useGetOrderDetail(orderId);
  const { mutate } = useCancelOrder();
  const { mutate: confirmReceived } = useReceivedOrder();
  const { mutate: refundOrder } = useRefundOrder();

  const order = data as Order;
  const [activeTab, setActiveTab] = useState("info");
  const isCancelOrder =
    order?.status === "pending" ||
    (order?.status === "completed" && order?.payment_method === "cod");

  const handleCancelOrder = () => {
    if (orderId) {
      mutate(orderId, {
        onSuccess: () => {
          toast.success("Đơn hàng đã được hủy thành công!");
          router.push("/orders");
        },
        onError: () => {
          toast.error("Đã xảy ra lỗi khi hủy đơn hàng!");
        },
      });
    }
  };
  const handleConfirmReceived = () => {
    if (orderId) {
      confirmReceived(orderId, {
        onSuccess: () => {
          toast.success("Đơn hàng đã được xác nhận đã nhận!");
          refetch();
        },
        onError: () => {
          toast.error("Đã xảy ra lỗi khi xác nhận đơn hàng!");
        },
      });
    }
  };

  const handleRequestRefund = () => {
    if (orderId) {
      refundOrder(orderId, {
        onSuccess: () => {
          toast.success("Yêu cầu hoàn tiền đã được gửi!");
          refetch();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "paid":
        return "Đã thanh toán";
      case "canceled":
        return "Đã hủy";
      case "completed":
        return "Đã hoàn thành";
      case "out_of_stock":
        return "Hết hàng";
      case "admin_canceled":
        return "Đã hủy bởi admin";
      case "received":
        return "Đã nhận hàng";
      case "need_refund":
        return "Cần hoàn tiền";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "out_of_stock":
        return "bg-orange-100 text-orange-800";
      case "admin_canceled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      case "need_refund":
        return "bg-orange-100 text-orange-800";
      case "received":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodTranslation = (method: string) => {
    switch (method) {
      case "wallet":
        return "Ví tiền";
      case "cod":
        return "Thanh toán tiền mặt";
      case "credit_card":
        return "Thẻ tín dụng";
      case "momo":
        return "Ví MoMo";
      case "zalopay":
        return "Zalopay";
      default:
        return method;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  if (isPending || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push("/orders")}
          className="mr-4 text-gray-600 hover:text-orange-500 transition cursor-pointer"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          Chi Tiết Đơn Hàng #{order.order_code}
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 mr-2 font-medium cursor-pointer ${
            activeTab === "info"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("info")}
        >
          Thông Tin Đơn Hàng
        </button>
        <button
          className={`px-4 py-2 font-medium cursor-pointer ${
            activeTab === "items"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("items")}
        >
          Sản Phẩm ({order.order_items_count})
        </button>
      </div>

      {/* Order Information Tab */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Status and Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiPackage className="mr-2" /> Trạng Thái Đơn Hàng
            </h2>

            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                  order.status
                )}`}
              >
                {getStatusTranslation(order.status)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <FiCalendar className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiClock className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                  <p className="font-medium">{formatDate(order.updated_at)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiDollarSign className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">
                    Phương thức thanh toán
                  </p>
                  <p className="font-medium">
                    {getPaymentMethodTranslation(order.payment_method)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiUser className="mr-2" /> Thông Tin Khách Hàng
            </h2>

            <div className="space-y-3">
              <div className="flex items-start">
                <FiUser className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Người nhận</p>
                  <p className="font-medium">{order.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiPhone className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{order.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiMail className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiMapPin className="text-gray-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                  <p className="font-medium">
                    {order.address}, {order.ward}, {order.district},{" "}
                    {order.province}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.note && (
            <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold mb-2">Ghi Chú</h2>
              <p className="text-gray-700">{order.note}</p>
            </div>
          )}
        </div>
      )}

      {/* Order Items Tab */}
      {activeTab === "items" && (
        <div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiShoppingBag className="mr-2" /> Sản Phẩm Trong Đơn
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Sản phẩm</th>
                    <th className="py-2 px-4 text-right">Đơn giá</th>
                    <th className="py-2 px-4 text-center">Số lượng</th>
                    <th className="py-2 px-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="h-16 w-12 flex-shrink-0 mr-4 bg-gray-200 rounded overflow-hidden">
                            <Image
                              src={item.image || "/api/placeholder/100/160"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              width={100}
                              height={160}
                              layout="responsive"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Mã: {item.orderable_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-4 px-4 text-center">{item.quantity}</td>
                      <td className="py-4 px-4 text-right font-medium">
                        {formatCurrency(
                          (Number(item.price) * item.quantity).toString()
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td
                      colSpan={3}
                      className="py-4 px-4 text-right font-semibold"
                    >
                      Tổng cộng
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-orange-600">
                      {formatCurrency(order.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order Summary for mobile view */}
          <div className="md:hidden bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Tóm Tắt Đơn Hàng</h2>
            <div className="flex justify-between mb-2">
              <span>Tổng số sản phẩm:</span>
              <span>{order.order_items_count}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tổng thanh toán:</span>
              <span className="font-bold text-orange-600">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        {isCancelOrder && (
          <button
            className="px-4 cursor-pointer py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            onClick={handleCancelOrder}
          >
            Hủy Đơn Hàng
          </button>
        )}
        {order?.status === "shipped" && (
          <button
            className="px-4 cursor-pointer py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
            onClick={handleConfirmReceived}
          >
            Xác Nhận Đã Nhận Hàng
          </button>
        )}

        {order?.status === "completed" && order?.payment_method !== "cod" && (
          <button
            className="px-4 cursor-pointer py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
            onClick={handleRequestRefund}
          >
              Yêu Cầu Hoàn Tiền
          </button>
        )}
        {/* <button className="px-4 cursor-pointer py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition">
          In Đơn Hàng
        </button>
        <button className="px-4 cursor-pointer py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition">
          Liên Hệ Hỗ Trợ
        </button> */}
      </div>
      <OrderFeedback
        order={order}
        feedbackInit={order.feedback}
        refetch={refetch}
      />
    </div>
  );
}
