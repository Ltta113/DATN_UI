"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationItem from "./NotificationItem";

export interface Notification {
  id: number;
  user_id: number;
  order_code: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
  userId,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách thông báo
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        try {
          // Đối với API thực tế:
          // const response = await fetch('/api/notifications');
          // const data = await response.json();
          // setNotifications(data.notifications);
          // setNotificationCount(data.notifications.filter(n => !n.is_read).length);

          // Tạm thời sử dụng dữ liệu mẫu để demo
          const demoNotifications: Notification[] = [
            {
              id: 1,
              user_id: userId,
              order_code: "ORD-12345",
              title: "Đơn hàng đã được xác nhận",
              message:
                "Đơn hàng #ORD-12345 của bạn đã được xác nhận và đang được xử lý.",
              is_read: false,
              created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            },
            {
              id: 2,
              user_id: userId,
              order_code: "ORD-12345",
              title: "Đơn hàng đang vận chuyển",
              message: "Đơn hàng của bạn đã được giao cho đơn vị vận chuyển.",
              is_read: false,
              created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            },
            {
              id: 3,
              user_id: userId,
              order_code: null,
              title: "Giảm giá 20%",
              message:
                "Chương trình giảm giá 20% cho tất cả sách văn học đã bắt đầu!",
              is_read: true,
              created_at: new Date(
                Date.now() - 1000 * 60 * 60 * 24
              ).toISOString(),
            },
            {
              id: 4,
              user_id: userId,
              order_code: null,
              title: "Sách bạn quan tâm đã có hàng",
              message:
                "Cuốn sách 'Đắc Nhân Tâm' bạn đang theo dõi đã có hàng trở lại.",
              is_read: false,
              created_at: new Date(
                Date.now() - 1000 * 60 * 60 * 36
              ).toISOString(),
            },
            {
              id: 5,
              user_id: userId,
              order_code: null,
              title: "Mã giảm giá mới",
              message:
                "Bạn đã nhận được mã giảm giá SACHNEW50 trị giá 50.000đ.",
              is_read: true,
              created_at: new Date(
                Date.now() - 1000 * 60 * 60 * 48
              ).toISOString(),
            },
          ];

          setNotifications(demoNotifications);
          setNotificationCount(
            demoNotifications.filter((n) => !n.is_read).length
          );
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, userId]);

  // Đánh dấu đã đọc một thông báo
  const markAsRead = async (id: number) => {
    try {
      // Đối với API thực tế:
      // await fetch(`/api/notifications/${id}/mark-read`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // Cập nhật UI trước khi API hoàn thành
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );

      const updatedUnreadCount = notifications.filter(
        (n) => !n.is_read && n.id !== id
      ).length;
      setNotificationCount(updatedUnreadCount);
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
    }
  };

  // Đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = async () => {
    try {
      // Đối với API thực tế:
      // await fetch('/api/notifications/mark-all-read', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // Cập nhật UI trước khi API hoàn thành
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
      setNotificationCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Chuyển hướng đến trang thông báo
  const navigateToNotifications = () => {
    onClose();
    router.push("/notifications");
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
    >
      <div className="p-3 bg-orange-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Thông báo</h3>
        {notificationCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Không có thông báo nào
          </div>
        ) : (
          notifications
            .slice(0, 5)
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
              />
            ))
        )}
      </div>

      <div className="p-2 bg-gray-50 border-t border-gray-200">
        <button
          onClick={navigateToNotifications}
          className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
        >
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
}
