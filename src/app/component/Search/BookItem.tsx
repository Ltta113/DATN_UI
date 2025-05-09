"use client";

import Image from "next/image";
import { Book } from "app/lib/books";
import StarRating from "../BookList/TopSeller/StarRating";
import { useRouter } from "next/navigation";
import { FiBookmark, FiShoppingCart } from "react-icons/fi";
import { useBookmark } from "hooks/useBookmarks";
import { useAuth } from "app/context/AuthContext";
import { BsBookmarkFill } from "react-icons/bs";
import Link from "next/link";

const BookItem = ({ book }: { book: Book }) => {
  const router = useRouter();
  const mutation = useBookmark();
  const { user, loading } = useAuth();

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutation.mutate(String(book.id));
  };

  const handleBookClick = () => {
    router.push(`/books/${book.slug}`);
  };

  const isBookmarked =
    !loading && user?.bookmarks?.some((b) => b.id === book.id);

  // Kiểm tra discount có active không
  const isDiscountActive =
    book.discount?.starts_at && book.discount?.expires_at
      ? new Date(book.discount.starts_at) <= new Date() &&
        new Date(book.discount.expires_at) >= new Date()
      : false;

  // Tính giá sau giảm
  const displayFinalPrice = Number(book.final_price || book.price);

  return (
    <div
      className="flex bg-gray-100 flex-row items-start gap-4 cursor-pointer w-3/7 p-4 rounded-lg shadow-md hover:shadow-lg transition relative"
      onClick={handleBookClick}
    >
      {/* Bìa sách */}
      <div className="h-64 w-48 relative shadow-2xl overflow-hidden rounded-sm transition-transform duration-300 transform hover:scale-105">
        {isDiscountActive && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
            {book.discount.type === "percent"
              ? `-${book.discount.value}%`
              : `Giảm ${book.discount.value.toLocaleString("vi-VN")} đ`}
          </div>
        )}
        <Image
          src={
            book.cover_image ||
            "https://res.cloudinary.com/dswj1rtvu/image/upload/v1745050814/BookStore/Books/no_cover_available_bjb33v.png"
          }
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Thông tin sách */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 break-words mb-1">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Tác giả:</strong>{" "}
            {book.authors.map((author, index) => (
              <span key={author.id}>
                <Link
                  href={`/authors/${author.slug}`}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {author.name}
                </Link>
                {index < book.authors.length - 1 && ", "}
              </span>
            ))}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            <strong>Nhà xuất bản:</strong> {book.publisher?.name || "Không rõ"}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            <strong>Thể loại:</strong>{" "}
            {book.categories.map((c, index) => (
              <span key={c.id}>
                <Link
                  href={`/search?category=${c.slug}`}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {c.name}
                </Link>
                {index < book.categories.length - 1 && ", "}
              </span>
            ))}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            <strong>Ngôn ngữ:</strong> {book.language?.toUpperCase()}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Số trang:</strong> {book.page_count || "N/A"}
          </p>

          {isDiscountActive ? (
            <div className="mb-2">
              <p className="text-sm text-gray-400 line-through">
                <strong>Giá gốc:</strong>{" "}
                {Number(book.price).toLocaleString("vi-VN")} đ
              </p>
              <p className="text-sm text-orange-600 font-semibold font-serif">
                <strong>Giá ưu đãi:</strong>{" "}
                {displayFinalPrice.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-xs text-green-600 italic mt-1">
                Ưu đãi: {book.discount.name}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mb-2">
              <strong>Giá:</strong> {Number(book.price).toLocaleString("vi-VN")}{" "}
              đ
            </p>
          )}
        </div>

        {/* Đánh giá */}
        <div className="flex justify-between items-center">
          <StarRating rating={book.star_rating} />
        </div>

        {/* Nút thao tác */}
        <div className="absolute bottom-2 right-2 flex space-x-3">
          <button
            className="p-2 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={handleBookmarkClick}
          >
            {isBookmarked ? (
              <BsBookmarkFill size={20} className="text-orange-500" />
            ) : (
              <FiBookmark size={20} />
            )}
          </button>
          <button
            className="p-2 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={(e) => e.stopPropagation()}
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
