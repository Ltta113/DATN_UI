"use client";

import Image from "next/image";
import { Book } from "app/lib/books";
import StarRating from "../BookList/TopSeller/StarRating";
import { useRouter } from "next/navigation";
import { FiBookmark, FiShoppingCart } from "react-icons/fi";
import { useBookmark } from "hooks/useBookmarks";
import { useAuth } from "app/context/AuthContext";
import { BsBookmarkFill } from "react-icons/bs";

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

  const isBookmarked = !loading && user?.bookmarks?.some((b) => b.id === book.id);

  return (
    <div
      className="flex bg-gray-100 flex-row items-start gap-4 cursor-pointer w-3/7 p-4 rounded-lg shadow-md hover:shadow-lg transition relative"
      onClick={handleBookClick}
    >
      <div className="h-64 w-48 relative shadow-2xl overflow-hidden rounded-sm transition-transform duration-300 transform hover:scale-105">
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
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 break-words mb-1">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Tác giả:</strong>{" "}
            {book.authors.map((author) => author.name).join(", ")}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Nhà xuất bản:</strong> {book.publisher?.name || "Không rõ"}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Thể loại:</strong>{" "}
            {book.categories.map((c) => c.name).join(", ")}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Ngôn ngữ:</strong> {book.language?.toUpperCase()}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Số trang:</strong> {book.page_count || "N/A"}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Giá:</strong> {Number(book.price).toLocaleString("vi-VN")} đ
          </p>
        </div>
        <div className="flex justify-between items-center">
          <StarRating rating={4} />
        </div>
        <div className="absolute bottom-2 right-2 flex space-x-3">
          <button
            className="p-2 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={handleBookmarkClick}
          >
            {isBookmarked ? <BsBookmarkFill size={20} className="text-orange-500" /> : <FiBookmark size={20} />}
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
