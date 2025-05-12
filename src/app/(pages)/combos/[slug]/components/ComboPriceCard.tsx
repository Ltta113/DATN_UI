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

const PriceCard = ({ combo }: { combo: Combo }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [, setCartItem] = useState<(Combo & { quantity: number }) | null>(null);

  // Định dạng giá tiền
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(combo.price));

  // Định dạng tổng tiền
  const formattedTotal = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(combo.price) * quantity);

  useEffect(() => {
    const checkCartStatus = () => {
      const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
      const comboInCart = cart.find(
        (item: Book | Combo) => item.id === combo.id
      );

      if (comboInCart) {
        setIsInCart(true);
        setCartItem(comboInCart);
        setQuantity(comboInCart.quantity);
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
  }, [combo.id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");

    if (!cart.some((item: Book | Combo) => item.id === combo.id)) {
      const updatedCart = [...cart, { ...combo, quantity }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setIsInCart(true);
      setCartItem({ ...combo, quantity });

      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const removeFromCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
    const updatedCart = cart.filter(
      (item: Book | Combo) => item.id !== combo.id
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setIsInCart(false);
    setCartItem(null);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > combo.stock) return;

    setQuantity(newQuantity);

    if (isInCart) {
      const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
      const updatedCart = cart.map((item: Book & { quantity: number }) =>
        item.id === combo.id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItem({ ...combo, quantity: newQuantity });

      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  return (
    <div className="rounded-lg shadow-xl overflow-hidden bg-white border border-gray-200 relative">
      <div className="absolute right-0 top-0 bg-red-500 text-white py-1 px-3 rounded-sm font-bold z-10 shadow-md flex items-center gap-1">
        <BiTag className="w-4 h-4" />
        {combo.discount && (
          <span className="text-xs">
            GIẢM{" "}
            {new Intl.NumberFormat("vi-VN").format(
              Math.round(Number(combo.discount))
            )}{" "}
            %
          </span>
        )}
      </div>

      <div className="flex items-center p-4 bg-gray-50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-gray-700 gap-2">
            <BiBookOpen className="w-5 h-5" />
            <span className="font-medium">Sách điện tử</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-200">
        <span className="text-gray-700 text-lg">Giá bán</span>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-orange-600">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Quantity selector - vô hiệu hóa khi hết hàng */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">Số lượng:</span>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className={`px-3 py-1 ${
                quantity <= 1
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BiMinus />
            </button>
            <input
              type="number"
              min="1"
              max={combo.stock}
              disabled={combo.stock <= 0}
              value={quantity}
              onChange={(e) =>
                updateQuantity(Math.min(Number(e.target.value), combo.stock))
              }
              className={`w-12 text-center border-x border-gray-300 py-1 no-spinner ${
                combo.stock <= 0 ? "bg-gray-100" : ""
              }`}
            />
            <button
              onClick={() => updateQuantity(quantity + 1)}
              disabled={quantity >= combo.stock}
              className={`px-3 py-1 ${
                quantity >= combo.stock
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
              disabled={combo.stock <= 0}
              className={`w-full border py-3 rounded-md text-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                combo.stock <= 0
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
            disabled={combo.stock <= 0}
            className={`w-full py-3 rounded-md text-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer ${
              combo.stock <= 0
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
