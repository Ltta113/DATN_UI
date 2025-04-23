"use client";

import { useUpdateOrderStatus } from "hooks/useUpdateOrderStatus";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const orderId = searchParams?.get("order_id") || "unknown";

    const { mutate, isPending, isSuccess, isError, error } =
        useUpdateOrderStatus();

    useEffect(() => {
        if (orderId) {
            mutate(orderId);
        }
    }, [orderId, mutate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-4">
                🎉 Thanh toán thành công!
            </h1>
            <p className="text-lg text-gray-700 mb-2">
                Cảm ơn bạn đã thanh toán. Đơn hàng của bạn (ID:{" "}
                <strong>{orderId || "unknown"}</strong>) đang được xử lý.
            </p>

            {isPending && (
                <p className="text-yellow-500">Đang cập nhật trạng thái...</p>
            )}
            {isSuccess && (
                <p className="text-green-500">Đã cập nhật trạng thái thành công!</p>
            )}
            {isError && <p className="text-red-500">Lỗi: {error?.message}</p>}
        </div>
    );
}
