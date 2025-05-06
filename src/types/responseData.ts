export interface ResponseData<T = unknown> {
  message?: string;
  data?: T;
  recommendations?: T[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface Notification {
  id: number;
  user_id: number;
  order_code: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
export interface NotificationData<Notification> {
  message: string;
  notifications: Notification[];
  unread_count: number;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
