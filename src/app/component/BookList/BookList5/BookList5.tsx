"use client";

import { Book } from "app/lib/books";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  books: Book[];
  title?: string;
};

export default function BookCards({ title, books }: Props) {
  const router = useRouter();

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("vi-VN").format(numPrice);
  };

  const calculateDiscountPercent = (
    originalPrice: string,
    finalPrice: number | string
  ): number => {
    const original = parseFloat(originalPrice);
    const final =
      typeof finalPrice === "string" ? parseFloat(finalPrice) : finalPrice;
    return Math.round(((original - final) / original) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {books.map((book) => {
          const hasDiscount =
            parseFloat(book.price) >
            (typeof book.final_price === "string"
              ? parseFloat(book.final_price)
              : book.final_price);
          const discountPercent = hasDiscount
            ? calculateDiscountPercent(book.price, book.final_price)
            : 0;

          return (
            <div
              key={book.id}
              className="rounded-lg cursor-pointer overflow-hidden border border-red-200 bg-white h-full flex flex-col
            hover:shadow-lg transition-shadow duration-300 ease-in-out"
              onClick={() => router.push(`/books/${book.slug}`)}
            >
              {/* Image container with fixed height */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  width={200}
                  height={300}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Title */}
                {title && (
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">
                    {book.title}
                  </h3>
                )}

                {/* Price */}
                <div className="mt-auto">
                  <div className="flex items-center">
                    <span className="text-red-600 font-bold text-xl">
                      {formatPrice(book.final_price)} đ
                    </span>

                    {hasDiscount && book.discount.type === "percent" && (
                      <div className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        -{discountPercent}%
                      </div>
                    )}

                    {hasDiscount && book.discount.type === "amount" && (
                      <div className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        -{formatPrice(book.discount.value)} đ
                      </div>
                    )}
                  </div>

                  {hasDiscount && (
                    <div className="text-gray-500 line-through text-sm">
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
  );
}
