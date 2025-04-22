"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentCancel() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order_id") || "unknown";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        ❌ Thanh toán đã bị hủy
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        Đơn hàng <strong>{orderId}</strong> chưa được thanh toán.
      </p>
      <p className="text-gray-500">
        Bạn có thể thử lại thanh toán bất cứ lúc nào từ trang đơn hàng.
      </p>
    </div>
  );
}
