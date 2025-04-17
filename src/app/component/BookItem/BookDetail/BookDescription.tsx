import { Book } from "app/lib/books";
import React from "react";

const BookDescription = ({ book }: { book: Book }) => {
  return (
    <>
      {book.description && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-800 leading-relaxed text-left">
            {book.description}
          </p>
        </div>
      )}
    </>
  );
};

export default BookDescription;
