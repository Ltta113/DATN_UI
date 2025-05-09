"use client";

export interface Notification {
  id: number;
  user_id: number;
  order_code: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: number) => void;
}

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

export default function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  return (
    <div
      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
        !notification.is_read ? "bg-blue-50" : ""
      }`}
      onClick={() => onRead(notification.id)}
    >
      <div className="flex justify-between items-start">
        <h4
          className={`text-sm font-medium ${
            !notification.is_read ? "text-gray-900" : "text-gray-700"
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
  );
}
