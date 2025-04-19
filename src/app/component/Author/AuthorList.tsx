import React from "react";
import AuthorItem from "./AuthorItem";
import { Author } from "app/lib/books";

type AuthorResultListProps = {
  authors: Author[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  title?: string;
};

export default function AuthorResultList({
  authors,
  currentPage,
  totalPages,
  onPageChange,
  title = "Tác giả",
}: AuthorResultListProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8 pl-10 pr-10">{title}</h1>
      {authors && authors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {authors.map((author) => (
              <AuthorItem key={author.id} author={author} />
            ))}
          </div>
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
        <p className="text-center">Không có tác giả nào để hiển thị.</p>
      )}
    </div>
  );
}
