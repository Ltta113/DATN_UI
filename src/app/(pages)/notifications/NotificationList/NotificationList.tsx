"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiBell,
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiShoppingBag,
} from "react-icons/fi";
import { useMarkAsRead } from "hooks/useMarkAsRead";
import { useListNotification } from "hooks/useGetNotification";
import { useAuth } from "app/context/AuthContext";
import { useMarkAllAsRead } from "hooks/useMarkAll";
import { Notification } from "types/responseData";
import Loading from "app/component/Loading/Loading";

export default function UserNotificationList() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [, setNotificationCount] = useState(0);
  const { data, isPending } = useListNotification(1, 5);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        if (data) {
          setNotifications(data.notifications);
          setNotificationCount(data.unread_count);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const intervalId = setInterval(() => {
      if (user) {
        fetchNotifications();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [data, user]);

  const { mutate: markAllAsReadMutation } = useMarkAllAsRead();

  const markAllAsRead = async () => {
    try {
      markAllAsReadMutation(undefined, {
        onSuccess: () => {
          toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) => ({
              ...notification,
              is_read: true,
            }))
          );
          setNotificationCount(0);
        },
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const { mutate: markAsReadMutation } = useMarkAsRead();

  const markAsRead = async (id: string) => {
    try {
      markAsReadMutation(id.toString(), {
        onSuccess: (data) => {
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.id === Number(id)
                ? { ...notification, is_read: true }
                : notification
            )
          );
          if (data.order_code) {
            router.push(`/orders/${data.order_code}`);
          }
        },
      });

      // Cập nhật UI trước khi API hoàn thành
      const updatedUnreadCount = notifications.filter(
        (n) => !n.is_read && n.id !== Number(id)
      ).length;
      setNotificationCount(updatedUnreadCount);
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
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

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thông Báo Của Tôi</h1>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            <FiCheckCircle className="mr-2" />
            Đánh dấu đã xem tất cả
          </button>
        )}
      </div>

      {isPending && <Loading />}

      {!isPending && notifications.length === 0 ? (
        <div className="text-center py-8">
          <FiBell className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">Bạn chưa có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 hover:shadow-md cursor-pointer transition ${
                !notification.is_read ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FiShoppingBag className="text-orange-500 mr-2" />
                    <h3 className="font-medium text-lg">
                      {notification.title}
                    </h3>
                    {!notification.is_read && (
                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{notification.message}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1" />
                    <span>{formatDate(notification.created_at)}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-start">
                  <button
                    onClick={() => markAsRead(notification.id.toString())}
                    className={`p-2 rounded-full ${
                      notification.is_read
                        ? "text-gray-400 cursor-default"
                        : "text-blue-500 hover:bg-blue-100"
                    }`}
                    disabled={notification.is_read}
                    title={
                      notification.is_read ? "Đã đọc" : "Đánh dấu là đã đọc"
                    }
                  >
                    <FiCheck
                      className={`text-xl ${
                        notification.is_read ? "opacity-50" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
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
