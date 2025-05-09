"use client";

import { useEffect, useRef, useState } from "react";
import NotificationDropdown from "./NotificationDropDown";

interface NotificationButtonProps {
  userId: number;
}

export default function NotificationButton({
  userId,
}: NotificationButtonProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lấy số lượng thông báo chưa đọc
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // Đối với API thực tế:
        // const response = await fetch('/api/notifications/unread-count');
        // const data = await response.json();
        // setNotificationCount(data.count);

        // Tạm thời sử dụng số ngẫu nhiên để demo
        setNotificationCount(Math.floor(Math.random() * 5));
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchUnreadCount();

    // Thiết lập polling để cập nhật số lượng thông báo
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 60000); // Cập nhật mỗi phút

    return () => clearInterval(intervalId);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="relative" ref={buttonRef}>
      <button
        onClick={toggleNotifications}
        className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 relative"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        <span className="ml-2 hidden sm:inline-block">Thông báo</span>
        {/* Badge for notification count - Chỉ hiển thị khi có thông báo chưa đọc */}
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Notifications */}
      <NotificationDropdown
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        userId={userId}
      />
    </div>
  );
}
