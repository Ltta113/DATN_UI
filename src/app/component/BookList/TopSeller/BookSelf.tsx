"use client";

import { useRef, useState, useEffect } from "react";
import BookCard from "./BookCard";
import { Book } from "app/lib/books";
import Link from "next/link";

const BookShelf = ({ books }: { books: Book[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowArrows(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [books]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative bg-gray-100 rounded-lg shadow-md p-4">
      {showArrows && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-2 z-10 bottom-1/2 transform -translate-y-1/2 bg-gray-500/75 hover:bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-2 z-10 bottom-1/2 transform -translate-y-1/2 bg-gray-500/75 hover:bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}

      <div
        ref={scrollContainerRef}
        className="flex justify-between gap-6 p-4 overflow-x-hidden"
      >
        {books.map((book) => (
          <div key={book.id} className="flex-none">
            <Link href={`/books/${book.slug}`} key={book.id}>
              <BookCard book={book} />
            </Link>
          </div>
        ))}
      </div>

      <Link href="/books">
        <div className="absolute bottom-2 right-2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition duration-200">
          Xem thêm
        </div>
      </Link>
    </div>
  );
};

export default BookShelf;
