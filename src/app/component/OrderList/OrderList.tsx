"use client";

import { Order, useGetMyOrders } from "hooks/useGetMyOrders";
import React, { useEffect, useState } from "react";
import {
  FiShoppingBag,
  FiCalendar,
  FiSearch,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import Loading from "../Loading/Loading";
import { useRouter } from "next/navigation";

export default function UserOrderList() {
  const { data, isPending } = useGetMyOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const orders = (data as Order[]) || [];
    if (orders.length) {
      let filtered = [...orders];

      if (searchTerm) {
        filtered = filtered.filter((order) =>
          (order.order_code || order.id)
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });

      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  }, [data, searchTerm, sortOrder]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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
      case "out_of_stock":
        return "Hết hàng";
      case "refunded":
        return "Đã hoàn tiền";
      case "need_refund":
        return "Cần hoàn tiền";
      case "completed":
        return "Đã hoàn thành";
      case "admin_canceled":
        return "Đã hủy bởi admin";
      case "shipped":
        return "Đang giao hàng";
      case "paid":
        return "Đã thanh toán";
      case "received":
        return "Đã nhận hàng";
      case "canceled":
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
      case "canceled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      case "need_refund":
        return "bg-orange-100 text-orange-800";
      case "admin_canceled":
        return "bg-red-100 text-red-800";
      case "received":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Đơn Hàng Của Tôi</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-1 left-1 pt-3 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            placeholder="Tìm kiếm theo mã đơn hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={toggleSortOrder}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <FiCalendar />
          <span>Sắp xếp theo ngày</span>
          {sortOrder === "desc" ? <FiChevronDown /> : <FiChevronUp />}
        </button>
      </div>
      
      {!isPending && filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <FiShoppingBag className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">
            {searchTerm
              ? "Không tìm thấy đơn hàng phù hợp"
              : "Bạn chưa có đơn hàng nào"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Mã đơn
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Ngày đặt
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Tổng tiền
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-700">
                        #{order.order_code || order.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusTranslation(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isPending && <Loading />}
    </div>
  );
}
