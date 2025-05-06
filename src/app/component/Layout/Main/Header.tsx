"use client";

import CategoryContent from "app/(pages)/home/components/CategoryContent";
import { useAuth } from "app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Category } from "app/lib/books";
import { useListNotification } from "hooks/useGetNotification";
import { useMarkAsRead } from "hooks/useMarkAsRead";
import { useMarkAllAsRead } from "hooks/useMarkAll";
import { toast } from "react-toastify";

// Định nghĩa interface cho thông báo
interface Notification {
  id: number;
  user_id: number;
  order_code: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { data } = useListNotification(1, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (selectedCategory) params.set("category", selectedCategory);

    router.push(`/search?${params.toString()}`);
  };

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          const cart = JSON.parse(storedCart);
          setCartCount(cart.length);
        } catch {}
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleSelectCategory = (category: Category) => {
    const isSameCategory = selectedCategory === category.slug;
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim());
    }

    if (isSameCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category.slug);
      params.set("category", category.slug);
    }

    router.push(`/search?${params.toString()}`);
  };

  const navigateToCart = () => {
    router.push("/cart");
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const navigateToNotifications = () => {
    setShowNotifications(false);
    router.push("/notifications");
  };

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

  const markAsRead = async (id: number) => {
    try {
      markAsReadMutation(id.toString(), {
        onSuccess: (data) => {
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.id === id
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
        (n) => !n.is_read && n.id !== id
      ).length;
      setNotificationCount(updatedUnreadCount);
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
    }
  };

  // Format thời gian hiển thị
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Vừa xong";
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    }
  };

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <header className="bg-white shadow-xl py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
        {/* LEFT */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <span className="text-2xl font-bold text-orange-500">SachVN</span>
          </Link>
          <Link
            href="/trang-chu"
            className="flex items-center text-gray-700 hover:text-orange-500"
          >
            <span className="mr-2">🏠</span>
            <span>Trang chủ</span>
          </Link>
        </div>

        {/* CENTER: Search box */}
        <form
          onSubmit={handleSearch}
          className="relative flex-1 max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Tên sách, tác giả..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </form>

        {user && (
          <div className="relative" ref={notificationRef}>
            <button
              onClick={toggleNotifications}
              className="cursor-pointer flex items-center p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 relative"
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
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Dropdown Notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-120 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-3 bg-orange-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">Thông báo</h3>
                  {notificationCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {!notifications ? (
                    <div className="p-4 text-center text-gray-500">
                      Không có thông báo nào
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.is_read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.is_read
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        {notification.order_code && (
                          <span className="mt-1 inline-block text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                            Đơn hàng: {notification.order_code}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={navigateToNotifications}
                    className="w-full py-2 cursor-pointer text-center text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RIGHT: Auth & Cart */}
        <div className="flex items-center space-x-4">
          {/* Shopping Cart Button */}
          <button
            onClick={navigateToCart}
            className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 relative"
            aria-label="Shopping cart"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span className="ml-2 hidden sm:inline-block">Giỏ hàng</span>
            {/* Badge for cart items count */}
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          </button>
          {user ? (
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <Image
                src={
                  user.avatar ||
                  "https://res.cloudinary.com/dswj1rtvu/image/upload/v1745051027/BookStore/Authors/istockphoto-1451587807-612x612_f8h3fr.jpg"
                }
                alt="avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <span className="text-gray-700 hidden sm:inline-block">
                👋 Xin chào, {user.full_name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
            >
              <span className="mr-2">👤</span>
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <main className="container mx-auto w-[80%]">
        <div className="flex flex-col items-center">
          <CategoryContent
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
        </div>
      </main>
    </header>
  );
}
