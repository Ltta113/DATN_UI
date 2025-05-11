"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BiTrash,
  BiArrowBack,
  BiHomeAlt,
  BiCheck,
  BiErrorCircle,
} from "react-icons/bi";
import { Book } from "app/lib/books";
import Loading from "app/component/Loading/Loading";
import { OrderRequest, OrderResponse, useCheckOrder } from "hooks/useOrderBook";
import { useAuth } from "app/context/AuthContext";
import { toast } from "react-toastify";
import { useOrder } from "app/context/OrderContent";
import { useRouter } from "next/navigation";
import { Combo } from "app/component/Payment/OrderSummery/OrderSummery";

type CartItem = (Book | Combo) & {
  id: string;
  quantity: number;
  selected?: boolean;
};

const isBook = (
  item: CartItem
): item is Book & { id: string; quantity: number; selected?: boolean } => {
  return "cover_image" in item;
};

type ErrorType = {
  message: string;
  data: {
    books: Book[];
    combos: Combo[];
  };
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState<ErrorType>({
    message: "",
    data: {
      books: [],
      combos: [],
    },
  });

  const { user } = useAuth();
  const { setOrderData } = useOrder();

  const { mutate: createOrder, isPending, isSuccess } = useCheckOrder();

  const handleSubmit = async (event: React.FormEvent, type: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    event.preventDefault();

    const orderRequest: OrderRequest = {
      order_items: cartItems
        .filter((item) => item.selected)
        .map((item) => ({
          orderable_id: Number(item.id),
          orderable_type: isBook(item) ? "book" : "combo",
          quantity: item.quantity,
        })),
    };

    try {
      createOrder(orderRequest, {
        onSuccess: (data: OrderResponse) => {
          if (type === "order") toast.success("Xác nhận đơn hàng thành công ");
          else toast.success("Cập nhật giỏ hàng thành công");
          setErrors({
            message: "",
            data: {
              books: [],
              combos: [],
            },
          });
          setOrderData(data.order);
          if (type === "order") {
            const updatedCart = cartItems.filter(
              (item) => item.selected === false
            );
            setCartItems(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("cartUpdated"));
            router.push("/cart/checkout");
          }
        },
        onError: (error) => {
          if (error.response?.status === 422) {
            const errorData = error.response.data as ErrorType;
            setErrors(errorData);
            toast.error(errorData.message || "Có lỗi xảy ra khi đặt hàng");
          } else {
            toast.error("Có lỗi xảy ra khi đặt hàng");
          }
        },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng");
    }
  };

  useEffect(() => {
    const loadCart = () => {
      setIsLoading(true);
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const cartWithSelection: CartItem[] = cart.map((item: CartItem) => ({
          ...item,
          selected: item.selected === undefined ? true : item.selected,
        }));
        setCartItems(cartWithSelection);

        setSelectAll(
          cartWithSelection.length > 0 &&
            cartWithSelection.every((item) => item.selected)
        );
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

  const hasItemError = (itemId: number, item: CartItem) => {
    if (isBook(item)) {
      return errors.data.books.some((errorItem) => errorItem.id === itemId);
    }
    return errors.data.combos.some((errorItem) => errorItem.id === itemId);
  };

  const getItemStock = (itemId: number, item: CartItem) => {
    if (isBook(item)) {
      const errorItem = errors.data.books.find((item) => item.id === itemId);
      return errorItem?.stock || 0;
    }
    const errorItem = errors.data.combos.find((item) => item.id === itemId);
    return errorItem?.stock || 0;
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      const updatedCart = cartItems.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    }

    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    if (hasItemError(itemId, item)) {
      const stock = getItemStock(itemId, item);
      if (newQuantity > stock) {
        toast.warning(`Chỉ còn ${stock} sản phẩm trong kho`);
        newQuantity = stock;
      }
    }

    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleItemSelection = (itemId: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, selected: !item.selected } : item
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);

    // Update selectAll based on new selections
    setSelectAll(updatedCart.every((item) => item.selected));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedCart = cartItems.map((item) => ({
      ...item,
      selected: newSelectAll,
    }));

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

  const getFinalPrice = (item: CartItem): number => {
    if (isBook(item)) {
      return Number(item.final_price);
    }
    return Number(item.price);
  };

  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => item.selected)
      .reduce((total, item) => total + getFinalPrice(item) * item.quantity, 0);
  };

  const calculatePricetotal = () => {
    return cartItems
      .filter((item) => item.selected)
      .reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  };

  const calculateDistotal = () => {
    return cartItems
      .filter((item) => item.selected)
      .reduce(
        (total, item) =>
          total + (Number(item.price) - getFinalPrice(item)) * item.quantity,
        0
      );
  };

  const getSelectedCount = () => {
    return cartItems.filter((item) => item.selected).length;
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

        {/* Thông báo lỗi chung */}
        {errors.message && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
            <BiErrorCircle
              className="text-red-500 flex-shrink-0 mt-1 mr-2"
              size={20}
            />
            <div>
              <p className="font-medium">{errors.message}</p>
              <p className="text-sm mt-1">
                Vui lòng kiểm tra số lượng sản phẩm bên dưới.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-5 h-5 border border-gray-300 rounded mr-2 flex items-center justify-center cursor-pointer"
                      onClick={toggleSelectAll}
                    >
                      {selectAll && <BiCheck className="text-orange-500" />}
                    </div>
                    <h2 className="font-semibold text-gray-800">
                      Chọn tất cả ({cartItems.length}) | Đã chọn (
                      {getSelectedCount()})
                    </h2>
                  </div>
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
                  <div
                    key={item.id}
                    className={`p-4 flex flex-col sm:flex-row ${
                      hasItemError(item.id, item) ? "bg-red-50" : ""
                    }`}
                  >
                    <div className="flex items-center mr-3">
                      <div
                        className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer"
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        {item.selected && (
                          <BiCheck className="text-orange-500" />
                        )}
                      </div>
                    </div>

                    <div className="sm:w-24 h-32 mb-4 sm:mb-0 flex-shrink-0">
                      <div className="relative h-full w-full bg-gray-100 rounded-md overflow-hidden">
                        {isBook(item) ? (
                          <Image
                            src={item.cover_image}
                            alt={item.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        ) : (
                          <Image
                            src={item.image}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 sm:ml-4 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/books/${item.id}`}
                          className="text-lg font-medium text-gray-800 hover:text-orange-500"
                        >
                          {isBook(item) ? item.title : item.name}
                        </Link>
                        {isBook(item) && (
                          <p className="text-gray-600 text-sm mt-1">
                            {item.authors
                              .map((author) => author.name)
                              .join(", ")}
                          </p>
                        )}

                        {/* Thông báo lỗi cho từng sản phẩm */}
                        {hasItemError(item.id, item) && (
                          <div className="mt-2 text-red-600 flex items-center text-sm">
                            <BiErrorCircle className="mr-1" />
                            <span>
                              Chỉ còn {getItemStock(item.id, item)} sản phẩm
                              trong kho
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex items-center justify-between mt-4">
                        {item.discount && (
                          <div className="mt-1">
                            <span className="font-semibold text-red-600">
                              {formatPrice(getFinalPrice(item))}
                            </span>
                            <span className="text-gray-500 text-sm line-through ml-2">
                              {formatPrice(Number(item.price))}
                            </span>
                          </div>
                        )}

                        {!item.discount && (
                          <div className="mt-1">
                            <span className="font-semibold text-red-600">
                              {formatPrice(Number(item.price))}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between py-3">
                          {/* Điều khiển số lượng và nút xóa */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className={`px-2 py-1 text-gray-700 ${
                                  item.quantity <= 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "hover:bg-gray-100"
                                }`}
                                disabled={item.quantity <= 1}
                              >
                                <span className="text-lg font-medium">−</span>
                              </button>

                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    item.id,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-8 text-center border-x border-gray-300 py-1 no-spinner"
                              />

                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                              >
                                <span className="text-lg font-medium">+</span>
                              </button>
                            </div>

                            {/* Giá hiện tại */}
                            <div className="font-semibold text-red-600 ml-4">
                              {formatPrice(getFinalPrice(item) * item.quantity)}
                            </div>

                            {/* Nút xóa */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-3 text-gray-500 hover:text-gray-700"
                              aria-label="Xóa sản phẩm"
                            >
                              <BiTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <Link
                href="/trang-chu"
                className="text-orange-500 hover:text-orange-600 flex items-center transition duration-200"
              >
                <BiArrowBack className="mr-2 text-lg" />
                <span className="font-medium">Tiếp tục mua sắm</span>
              </Link>

              <button
                type="button"
                disabled={getSelectedCount() === 0 || isPending}
                onClick={(e) => handleSubmit(e, "update")}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow transition duration-200 cursor-pointer"
              >
                🛒 Cập nhật giỏ hàng
              </button>
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
                    <span className="text-gray-600">
                      Tạm tính ({getSelectedCount()} sản phẩm)
                    </span>
                    <span className="font-medium">
                      {formatPrice(calculatePricetotal())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá</span>
                    <span className="font-medium">
                      {formatPrice(calculateDistotal())}
                    </span>
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

                <button
                  className={`w-full py-3 rounded-md text-lg font-medium transition-colors mt-4 ${
                    getSelectedCount() > 0
                      ? isPending
                        ? "bg-orange-300 text-white cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={getSelectedCount() === 0 || isPending}
                  onClick={(e) => handleSubmit(e, "order")}
                >
                  {isPending ? "Đang xử lý..." : "Tiến hành thanh toán"}
                </button>

                {isSuccess && (
                  <div className="mt-3 p-2 bg-green-50 text-green-700 text-sm rounded-md flex items-center">
                    <BiCheck className="mr-1" size={18} />
                    Đặt hàng thành công!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
