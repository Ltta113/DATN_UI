import React from "react";
import BookItem from "./BookItem";
import { Book } from "app/lib/books";

type BookResultListProps = {
  message?: string;
  books: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function BookResultList({
  message,
  books,
  currentPage,
  totalPages,
  onPageChange,
}: BookResultListProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8 pl-10 pr-10">
        {message || "Sách liên quan"}
      </h1>
      {books && books.length > 0 ? (
        <>
          <div className="flex flex-wrap justify-center gap-4">
            {books.map((book) => (
              <BookItem key={book.id} book={book} />
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
            >
              Trang trước
            </button>
            <span className="px-4 py-2 font-semibold">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
            >
              Trang sau
            </button>
          </div>
        </>
      ) : (
        <p className="text-center">Không có sách nào để hiển thị.</p>
      )}
    </div>
  );
}
