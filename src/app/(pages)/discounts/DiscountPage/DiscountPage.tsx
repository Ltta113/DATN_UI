"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDiscountsWithoutBooks } from "hooks/useGetListDiscounts";
import { Discount } from "app/lib/books";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BiHomeAlt } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Format date to a more readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const DiscountPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useDiscountsWithoutBooks(currentPage, 1);

  const discounts = data?.data as Discount[];
  const pagination = data?.pagination;

  const router = useRouter();

  // State to track which promotion is being hovered
  const [hoveredPromotion, setHoveredPromotion] = useState<number | null>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.last_page || 1)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[80%]">
      <div className="flex items-center mb-6">
        <Link
          href="/"
          className="text-gray-600 hover:text-orange-500 flex items-center"
        >
          <BiHomeAlt className="mr-2" />
          Trang chủ
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800 font-medium">Khuyến mãi</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 cursor-pointer">
        {discounts?.map((promotion: Discount) => (
          <div
            key={promotion.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col relative"
          >
            <div
              className="relative overflow-hidden h-[250px]"
              onMouseEnter={() => setHoveredPromotion(promotion.id)}
              onMouseLeave={() => setHoveredPromotion(null)}
            >
              <Image
                src={promotion.banner}
                alt={promotion.name}
                fill
                className={`
                  absolute object-cover transition-transform duration-300
                  ${
                    hoveredPromotion === promotion.id
                      ? "scale-110"
                      : "scale-100"
                  }
                `}
              />
              <span className="absolute top-4 right-4 px-3 py-1 pt-1 pb-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                {promotion.type === "percent"
                  ? `Giảm ${promotion.value}%`
                  : `Giảm ${formatPrice(promotion.value)}`}
              </span>
            </div>

            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 uppercase text-red-500">
                  {promotion.name}
                </h3>
              </div>
              <div>
                <div className="flex justify-between text-orange-500 mb-2 font-bold text-sm">
                  <span>Bắt đầu: {formatDate(promotion.starts_at)}</span>
                  <span>Kết thúc: {formatDate(promotion.expires_at)}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-orange-300">
                  <div className="text-orange-300 italic">Xem chi tiết</div>
                  <div
                    className="text-black uppercase hover:text-orange-500 hover:underline"
                    onClick={() => router.push(`/discounts/${promotion.id}`)}
                  >
                    Xem tại đây
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 cursor-pointer rounded-full bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          <span className="text-gray-700">
            Trang {currentPage} / {pagination.last_page}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.last_page}
            className="p-2 cursor-pointer rounded-full bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscountPage;
