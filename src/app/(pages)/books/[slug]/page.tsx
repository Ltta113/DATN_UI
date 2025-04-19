"use client";

import BookCover from "app/component/BookItem/BookDetail/BookCover";
import BookDescription from "app/component/BookItem/BookDetail/BookDescription";
import BookDetails from "app/component/BookItem/BookDetail/BookDetail";
import PriceCard from "app/component/BookItem/BookDetail/PriceCard";
import Loading from "app/component/Loading/Loading";
import { Book } from "app/lib/books";
import { useGetBook } from "hooks/useGetBook";

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
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row gap-6 bg-gray-100 p-6 rounded-lg shadow-md">
              <BookCover book={book} />
              <BookDetails book={book} />
            </div>
            <BookDescription book={book} />
          </div>
          <div className="lg:w-1/3">
            <PriceCard book={book} />
          </div>
        </div>
      </div>
    </div>
  );
}
