import { Book } from "app/lib/books";
import { Combo } from "app/component/Payment/OrderSummery/OrderSummery";
import React, { useState, useEffect } from "react";
import {
  BiBookOpen,
  BiShoppingBag,
  BiTrash,
  BiMinus,
  BiPlus,
  BiTag,
} from "react-icons/bi";

const PriceCard = ({ book }: { book: Book }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [, setCartItem] = useState<(Book & { quantity: number }) | null>(null);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const isSoldOut = book.status === "sold_out";

  // Định dạng giá tiền
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(book.price));

  // Định dạng giá cuối cùng sau khuyến mãi
  const formattedFinalPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(book.final_price));

  // Định dạng tổng tiền
  const formattedTotal = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(book.final_price) * quantity);

  useEffect(() => {
    const checkCartStatus = () => {
      const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
      const bookInCart = cart.find((item: Book | Combo) => item.id === book.id);

      if (bookInCart) {
        setIsInCart(true);
        setCartItem(bookInCart);
        setQuantity(bookInCart.quantity);
      } else {
        setIsInCart(false);
        setCartItem(null);
        setQuantity(1);
      }
    };

    checkCartStatus();

    window.addEventListener("storage", checkCartStatus);
    window.addEventListener("cartUpdated", checkCartStatus);
    return () => {
      window.removeEventListener("storage", checkCartStatus);
      window.removeEventListener("cartUpdated", checkCartStatus);
    };
  }, [book.id]);

  // Kiểm tra và cập nhật khuyến mãi đang hoạt động
  useEffect(() => {
    if (!book.discount) return;

    const currentDiscount = book.discount;

    // Thiết lập đếm ngược nếu có khuyến mãi
    if (currentDiscount) {
      const updateCountdown = () => {
        const now = new Date();
        const endDate = new Date(currentDiscount.expires_at);
        const timeRemaining = endDate.getTime() - now.getTime();

        if (timeRemaining <= 0) {
          setCountdown(null);
          return;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      };

      updateCountdown();
      const countdownInterval = setInterval(updateCountdown, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [book.discount]);

  const addToCart = () => {
    // Không cho phép thêm vào giỏ hàng nếu hết hàng
    if (isSoldOut) return;

    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");

    if (!cart.some((item: Book | Combo) => item.id === book.id)) {
      const updatedCart = [...cart, { ...book, quantity }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setIsInCart(true);
      setCartItem({ ...book, quantity });

      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const removeFromCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
    const updatedCart = cart.filter(
      (item: Book | Combo) => item.id !== book.id
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setIsInCart(false);
    setCartItem(null);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (newQuantity: number) => {
    // Không cho phép cập nhật số lượng nếu hết hàng
    if (isSoldOut) return;
    if (newQuantity < 1 || newQuantity > book.stock) return;

    setQuantity(newQuantity);

    if (isInCart) {
      const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
      const updatedCart = cart.map((item: Book & { quantity: number }) =>
        item.id === book.id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItem({ ...book, quantity: newQuantity });

      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  return (
    <div className="rounded-lg shadow-xl overflow-hidden bg-white border border-gray-200 relative">
      {/* Tag "Hết hàng" hiển thị xéo qua card khi status = sold_out */}
      {isSoldOut && (
        <div className="absolute -right-12 top-6 rotate-45 bg-red-600 text-white py-1 w-40 text-center font-bold z-10 shadow-md">
          HẾT HÀNG
        </div>
      )}

      {/* Tag khuyến mãi nếu có */}
      {book.discount && (
        <div className="absolute right-0 top-0 bg-red-500 text-white py-1 px-3 rounded-sm font-bold z-10 shadow-md flex items-center gap-1">
          <BiTag className="w-4 h-4" />
          {book.discount.type === "amount"
            ? `GIẢM ${new Intl.NumberFormat("vi-VN", {}).format(
                Number(book.discount.value)
              )} VND`
            : `GIẢM ${book.discount.value}%`}
        </div>
      )}

      <div className="flex items-center p-4 bg-gray-50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-gray-700 gap-2">
            <BiBookOpen className="w-5 h-5" />
            <span className="font-medium">Sách điện tử</span>
          </div>
        </div>
      </div>

      {/* Hiển thị thông tin khuyến mãi nếu có */}
      {book.discount && (
        <div className="bg-orange-50 p-3 border-t border-b border-orange-100">
          <div className="text-orange-800 font-medium mb-1">
            {book.discount.name}
          </div>

          {book.discount.description && (
            <p className="text-orange-700 text-sm mb-2">
              {book.discount.description}
            </p>
          )}

          {/* Đồng hồ đếm ngược */}
          {countdown && (
            <div className="mt-2">
              <p className="text-xs text-orange-600 mb-1">Kết thúc sau:</p>
              <div className="flex gap-2 justify-center">
                <div className="bg-orange-500 text-white rounded px-2 py-1 text-xs flex flex-col items-center">
                  <span className="font-bold">{countdown.days}</span>
                  <span className="text-xs">Ngày</span>
                </div>
                <div className="bg-orange-500 text-white rounded px-2 py-1 text-xs flex flex-col items-center">
                  <span className="font-bold">{countdown.hours}</span>
                  <span className="text-xs">Giờ</span>
                </div>
                <div className="bg-orange-500 text-white rounded px-2 py-1 text-xs flex flex-col items-center">
                  <span className="font-bold">{countdown.minutes}</span>
                  <span className="text-xs">Phút</span>
                </div>
                <div className="bg-orange-500 text-white rounded px-2 py-1 text-xs flex flex-col items-center">
                  <span className="font-bold">{countdown.seconds}</span>
                  <span className="text-xs">Giây</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center p-4 border-t border-gray-200">
        <span className="text-gray-700 text-lg">Giá bán</span>
        <div className="flex flex-col items-end">
          {book.discount ? (
            <>
              <span className="text-2xl font-bold text-orange-600">
                {formattedFinalPrice}
              </span>
              <span className="text-sm line-through text-gray-500">
                {formattedPrice}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-orange-600">
              {formattedPrice}
            </span>
          )}
        </div>
      </div>

      {/* Quantity selector - vô hiệu hóa khi hết hàng */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">Số lượng:</span>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1 || isSoldOut}
              className={`px-3 py-1 ${
                quantity <= 1 || isSoldOut
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BiMinus />
            </button>
            <input
              type="number"
              min="1"
              max={book.stock}
              disabled={book.stock <= 0 || isSoldOut}
              value={quantity}
              onChange={(e) =>
                updateQuantity(Math.min(Number(e.target.value), book.stock))
              }
              className={`w-12 text-center border-x border-gray-300 py-1 no-spinner ${
                isSoldOut ? "bg-gray-100" : ""
              }`}
            />
            <button
              onClick={() => updateQuantity(quantity + 1)}
              disabled={quantity >= book.stock || isSoldOut}
              className={`px-3 py-1 ${
                quantity >= book.stock || isSoldOut
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BiPlus />
            </button>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-between mt-2">
          <span className="text-gray-700 font-medium">Tổng cộng:</span>
          <span className="text-orange-600 font-semibold text-lg">
            {formattedTotal}
          </span>
        </div>
      </div>

      <div className="p-4 pt-0">
        {isInCart ? (
          <div className="space-y-2">
            <button
              onClick={() => updateQuantity(quantity)}
              disabled={isSoldOut}
              className={`w-full border py-3 rounded-md text-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                isSoldOut
                  ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
              }`}
            >
              <BiShoppingBag className="w-5 h-5" />
              Cập nhật giỏ hàng
            </button>
            <button
              onClick={removeFromCart}
              className="w-full bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 py-2 rounded-md text-base font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BiTrash className="w-5 h-5" />
              Xóa khỏi giỏ hàng
            </button>
          </div>
        ) : (
          <button
            onClick={addToCart}
            disabled={isSoldOut}
            className={`w-full py-3 rounded-md text-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer ${
              isSoldOut
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            <BiShoppingBag className="w-5 h-5" />
            Thêm vào giỏ hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default PriceCard;
