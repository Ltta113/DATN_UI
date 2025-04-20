"use client";

import BookCover from "app/component/BookItem/BookDetail/BookCover";
import BookDetails from "app/component/BookItem/BookDetail/BookDetail";
import PriceCard from "app/component/BookItem/BookDetail/PriceCard";
import Loading from "app/component/Loading/Loading";
import { Book } from "app/lib/books";
import { useGetBook } from "hooks/useGetBook";
import Link from "next/link";
import { BiHomeAlt } from "react-icons/bi";

export default function BookPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data, isPending, isError, error } = useGetBook(slug);

  const book = data as Book;

  if (isPending) return <Loading />;
  if (isError) return <div>{(error as Error).message}</div>;
  if (!book) return <div>Không tìm thấy sách</div>;

  return (
    <div className="min-h-screen rtl w-[80%] mx-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-orange-500 flex items-center"
          >
            <BiHomeAlt className="mr-2" />
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href="/books"
            className="text-gray-600 hover:text-orange-500 flex items-center"
          >
            <span>Sách</span>
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{book.title}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row gap-6 bg-gray-100 p-6 rounded-lg shadow-md">
              <BookCover book={book} />
              <BookDetails book={book} />
            </div>
            {/* <BookDescription book={book} /> */}
          </div>
          <div className="lg:w-1/3">
            <PriceCard book={book} />
          </div>
        </div>
      </div>
    </div>
  );
}
