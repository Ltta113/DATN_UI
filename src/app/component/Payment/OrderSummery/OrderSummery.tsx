import React from "react";
import Image from "next/image";
import { BiCheck } from "react-icons/bi";
import { Book } from "app/lib/books";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  orderable_type: string;
  orderable_id: number;
  books?: Book[];
}

interface OrderData {
  created_at: string;
  status: string;
  order_items: OrderItem[];
  total: number;
}

interface OrderSummaryProps {
  orderData: OrderData;
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderData,
  formatPrice,
  formatDate,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800 flex items-center">
          <span className="bg-orange-100 text-orange-600 p-1 rounded-full mr-2">
            <BiCheck />
          </span>
          Chi tiết đơn hàng
        </h2>
      </div>

      <div className="p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Ngày đặt hàng: {formatDate(orderData.created_at)}</span>
          <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium uppercase">
            {orderData.status === "pending"
              ? "Chờ thanh toán"
              : orderData.status}
          </span>
        </div>

        <div className="divide-y divide-gray-200">
          {orderData.order_items.map((item) => (
            <div key={item.id} className="py-4 flex">
              <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={96}
                  className="object-cover"
                />
              </div>

              <div className="ml-4 flex-1">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm">
                  {item.books?.map((a) => a.title).join(", ")}
                </p>

                <div className="flex justify-between items-end mt-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Đơn giá: </span>
                    <span className="font-medium">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Số lượng: </span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                  <div>
                    <span className="font-medium text-orange-600">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tạm tính:</span>
            <span>{formatPrice(orderData.total || 0)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span>{formatPrice(0)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
            <span>Tổng cộng:</span>
            <span className="text-orange-600">
              {formatPrice(orderData.total || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
