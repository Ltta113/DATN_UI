"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { Review } from "app/lib/books";
import { useAuth } from "app/context/AuthContext";
import Image from "next/image";

interface AllReviewsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  onEdit: (review: Review) => void;
  onDelete: (reviewId: number) => void;
}

export const AllReviewsDrawer: React.FC<AllReviewsDrawerProps> = ({
  isOpen,
  onClose,
  reviews,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return "Hôm nay";
      } else if (diffDays === 1) {
        return "Hôm qua";
      } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
      } else {
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    } catch {
      return dateString;
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Vô hiệu hóa cuộn trang khi drawer mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Lọc reviews theo tìm kiếm và rating
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      searchTerm === "" ||
      review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.full_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      filterRating === null || review.rating === filterRating;

    return matchesSearch && matchesRating;
  });

  // Sắp xếp với review của user hiện tại lên đầu
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (a.user.id === user?.id) return -1;
    if (b.user.id === user?.id) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 flex justify-end">
      <div
        ref={drawerRef}
        className="bg-white w-full max-w-2xl h-full shadow-lg transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Tất cả đánh giá ({reviews.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm đánh giá..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-700">Lọc theo:</span>
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1 border rounded-full text-sm cursor-pointer ${
                filterRating === null
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() =>
                  setFilterRating(filterRating === rating ? null : rating)
                }
                className={`px-3 py-1 border rounded-full text-sm flex items-center cursor-pointer ${
                  filterRating === rating
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {rating} <FaStar className="text-amber-400 ml-1" size={12} />
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto p-4">
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <div
                key={review.id}
                className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      {review.user.avatar ? (
                        <Image
                          src={review.user.avatar}
                          alt={review.user.full_name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                          {review.user.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {review.user.full_name}
                        {review.user.id === user?.id && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                            Bạn
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < review.rating ? "text-amber-400" : "text-gray-300"
                        }`}
                        size={16}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3 text-gray-700">{review.content}</div>

                {/* Action buttons for user's own reviews */}
                {user?.id === review.user.id && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => onEdit(review)}
                      className="mr-2 px-4 py-1 text-sm text-blue-600 hover:text-blue-800 
                      border border-blue-600 hover:bg-blue-600 rounded cursor-pointer"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => onDelete(review.id)}
                      className="px-4 py-1 text-sm text-red-600 hover:text-red-800 
                      border border-red-600 hover:bg-red-600 rounded cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy đánh giá nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
