"use client";

import BookShelf from "app/component/BookList/TopSeller/BookSelf";
import Loading from "app/component/Loading/Loading";
import BookSlider from "app/component/Slider/TopSlider/ImageSlider";
import { Book } from "app/lib/books";
import { useNewestBooks } from "hooks/useGetNewestBook";

const HomeContent = () => {
  const { data, isPending, isError } = useNewestBooks();

  const books = data?.data as Book[];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Sách mới nhất</h1>

      {isPending && <Loading />}
      {isError && (
        <p className="text-center text-red-500">Có lỗi khi tải dữ liệu!</p>
      )}

      {!isPending && !isError && books && <BookShelf books={books} />}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Sách bán chạy nhất</h1>
        <BookSlider />
      </div>
    </div>
  );
};

export default HomeContent;
