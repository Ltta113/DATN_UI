"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Discount } from "app/lib/books";
import Image from "next/image";
import { useGetDiscount } from "hooks/useGetDiscountDetail";
import { BiHomeAlt } from "react-icons/bi";

export default function DiscountDetailPage() {
  const router = useRouter();

  const params = useParams();

  const id = params?.id as string;

  const { data, isPending } = useGetDiscount(id);
  const discountData = data?.data as Discount;
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!discountData) return;

    const endTime = new Date(discountData.expires_at).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [discountData]);

  // Format number to always have 2 digits
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  // Format date to Vietnamese format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Function to format prices
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("vi-VN").format(numPrice);
  };

  // Function to calculate discount percentage
  const calculateDiscountPercent = (
    originalPrice: string,
    finalPrice: number | string
  ): number => {
    const original = parseFloat(originalPrice);
    const final =
      typeof finalPrice === "string" ? parseFloat(finalPrice) : finalPrice;
    return Math.round(((original - final) / original) * 100);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!discountData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-700">
            Không tìm thấy chương trình khuyến mãi
          </h1>
          <button
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => router.push("/")}
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
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
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{discountData.name}</span>
        </div>

        {/* Discount Header */}
        <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 mb-8 text-white">
          <div className="absolute top-0 right-0 p-4">
            <div className="bg-white rounded-lg p-3 shadow-md">
              <div className="text-center mb-2">
                <p className="text-gray-600 text-sm font-medium">
                  Kết thúc sau
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-md px-2 py-1 text-red-600 font-bold text-xl">
                    {formatNumber(timeLeft.days)}
                  </div>
                  <span className="text-gray-500 text-xs mt-1">Ngày</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-md px-2 py-1 text-red-600 font-bold text-xl">
                    {formatNumber(timeLeft.hours)}
                  </div>
                  <span className="text-gray-500 text-xs mt-1">Giờ</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-md px-2 py-1 text-red-600 font-bold text-xl">
                    {formatNumber(timeLeft.minutes)}
                  </div>
                  <span className="text-gray-500 text-xs mt-1">Phút</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-md px-2 py-1 text-red-600 font-bold text-xl">
                    {formatNumber(timeLeft.seconds)}
                  </div>
                  <span className="text-gray-500 text-xs mt-1">Giây</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{discountData.name}</h1>
          <p className="mb-4 max-w-xl">{discountData.description}</p>

          <div className="flex items-center space-x-8 mt-6">
            <div>
              <p className="text-sm opacity-80">Thời gian</p>
              <p className="font-medium mt-1">
                {formatDate(discountData.starts_at)} -{" "}
                {formatDate(discountData.expires_at)}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-80">Mức giảm giá</p>
              <p className="font-medium mt-1 flex items-center">
                <span className="bg-yellow-400 text-red-600 font-bold px-2 py-0.5 rounded mr-2">
                  -{discountData.value}%
                </span>
                cho tất cả sản phẩm
              </p>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {discountData.books.map((book) => {
            const hasDiscount =
              parseFloat(book.price) >
              (typeof book.final_price === "string"
                ? parseFloat(book.final_price as string)
                : book.final_price);
            const discountPercent = hasDiscount
              ? calculateDiscountPercent(book.price, book.final_price)
              : 0;

            return (
              <div
                key={book.id}
                onClick={() => router.push(`/books/${book.slug}`)}
                className="bg-white cursor-pointer rounded-lg overflow-hidden border border-gray-200 shadow-sm flex flex-col
                hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                {/* Image container with fixed height */}
                <div className="relative h-40 overflow-hidden p-2">
                  <Image
                    src={book.cover_image}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-3 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 h-10">
                    {book.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-3 h-3 ${
                            book.star_rating >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                      ({parseFloat((Number(book.star_rating) || 0).toFixed(1))})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto">
                    <div className="flex items-center">
                      <span className="text-red-600 font-bold text-base">
                        {formatPrice(book.final_price)} đ
                      </span>

                      {hasDiscount && discountData.type === "percent" && (
                        <div className="ml-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          -{discountPercent}%
                        </div>
                      )}
                      {hasDiscount && discountData.type === "amount" && (
                        <div className="ml-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          -{formatPrice(discountData.value)} đ
                        </div>
                      )}
                    </div>

                    {hasDiscount && (
                      <div className="text-gray-500 line-through text-xs">
                        {formatPrice(book.price)} đ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
