import { Book } from "app/lib/books";
import React from "react";
import { BiBookOpen } from "react-icons/bi";

const PriceCard = ({ book }: { book: Book }) => {

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(book.price));

  return (
    <div className="rounded-lg shadow-xl overflow-hidden bg-gray-100">
      <div className="flex items-center p-4">
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-end-safe text-gray-500 gap-2">
            <BiBookOpen className="w-5 h-5 ml-1" />
            <span>Mua ngay</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-500">
        <span className="text-gray-700 text-xl">Giá</span>
        <span className="text-2xl font-bold text-gray-800">
          {formattedPrice}
        </span>
      </div>

      <div className="p-4">
        <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-md text-xl font-bold transition-colors">
          Mua
        </button>
      </div>
    </div>
  );
};

export default PriceCard;
