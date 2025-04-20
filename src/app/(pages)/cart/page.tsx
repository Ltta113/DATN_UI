"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BiMinus,
  BiPlus,
  BiTrash,
  BiArrowBack,
  BiHomeAlt,
} from "react-icons/bi";
import { Book } from "app/lib/books";
import Loading from "app/component/Loading/Loading";

type CartItem = Book & { id: string; quantity: number };

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      setIsLoading(true);
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);
      } catch {
        setCartItems([]);
      }
      setIsLoading(false);
    };

    loadCart();
    window.addEventListener("storage", loadCart);
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const clearCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    setCartItems([]);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <Loading />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Đang tải giỏ hàng...
            </h2>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-orange-500 flex items-center"
            >
              <BiHomeAlt className="mr-2" />
              Trang chủ
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-medium">Giỏ hàng</span>
          </div>

          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BiTrash className="text-gray-400 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              href="/trang-chu"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center"
            >
              <BiArrowBack className="mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-orange-500 flex items-center"
          >
            <BiHomeAlt className="mr-2" />
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Giỏ hàng</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Giỏ hàng của bạn
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">
                    Sản phẩm trong giỏ hàng ({cartItems.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center cursor-pointer"
                  >
                    <BiTrash className="mr-1" />
                    Xóa tất cả
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                    <div className="sm:w-24 h-32 mb-4 sm:mb-0 flex-shrink-0">
                      <div className="relative h-full w-full bg-gray-100 rounded-md overflow-hidden">
                        {item.cover_image ? (
                          <Image
                            src={item.cover_image}
                            alt={item.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span>No image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 sm:ml-4 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/books/${item.id}`}
                          className="text-lg font-medium text-gray-800 hover:text-orange-500"
                        >
                          {item.title}
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.authors.map((author) => author.name).join(", ")}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                        <div className="flex items-center">
                          <span className="text-gray-700 mr-2">Số lượng:</span>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className={`px-2 py-1 ${
                                item.quantity <= 1
                                  ? "text-gray-300"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              disabled={item.quantity <= 1}
                            >
                              <BiMinus />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, Number(e.target.value))
                              }
                              className="w-12 text-center border-x border-gray-300 py-1 no-spinner"
                            />
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                            >
                              <BiPlus />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-3 sm:mt-0">
                          <div className="sm:mr-6">
                            <div className="text-orange-600 font-bold">
                              {formatPrice(Number(item.price))}
                            </div>
                            <div className="text-gray-600 text-sm">
                              {formatPrice(Number(item.price) * item.quantity)}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <BiTrash size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right mb-6">
              <Link
                href="/trang-chu"
                className="text-orange-500 hover:text-orange-600 flex items-center justify-end"
              >
                <BiArrowBack className="mr-2" />
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-24">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">
                  Tóm tắt đơn hàng
                </h2>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">
                      {formatPrice(calculateSubtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá</span>
                    <span className="font-medium">0 ₫</span>
                  </div>
                </div>

                <div className="my-4 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-orange-600">
                      {formatPrice(calculateSubtotal())}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm text-right mt-1">
                    (Đã bao gồm VAT nếu có)
                  </div>
                </div>

                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md text-lg font-medium transition-colors mt-4">
                  Tiến hành thanh toán
                </button>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-center">
                  <span className="text-gray-600 text-sm">
                    Chúng tôi chấp nhận
                  </span>
                  <div className="flex space-x-2 ml-2">
                    <div className="w-10 h-6 bg-blue-600 rounded"></div>
                    <div className="w-10 h-6 bg-red-500 rounded"></div>
                    <div className="w-10 h-6 bg-green-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
