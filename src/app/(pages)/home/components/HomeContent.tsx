"use client";

import BookShelf from "app/component/BookList/TopSeller/BookSelf";
import DiscountSection from "app/component/Discount/DiscountSection/DiscountSection";
import Loading from "app/component/Loading/Loading";
import NavigationBar from "app/component/NavBar/NavigationBar";
import BookSlider from "app/component/Slider/TopSlider/ImageSlider";
import { Book, Discount } from "app/lib/books";
import { useListDiscounts } from "hooks/useGetDiscounts";
import { useNewestBooks } from "hooks/useGetNewestBook";

const HomeContent = () => {
  const { data, isPending, isError } = useNewestBooks();
  const { data: discountsData, isPending: isPendingDiscount } =
    useListDiscounts();

  const books = data?.data as Book[];

  const discounts = discountsData as Discount[];

  return (
    <div className="container mx-auto py-8">
      <NavigationBar />
      <h1 className="text-3xl font-bold mb-8 text-center mt-4">Sách mới nhất</h1>

      {isPending && <Loading />}
      {isError && (
        <p className="text-center text-red-500">Có lỗi khi tải dữ liệu!</p>
      )}

      {!isPending && !isError && books && <BookShelf books={books} />}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Sách bán mới nhất</h1>
        <BookSlider />
      </div>
      {isPendingDiscount && <Loading />}
      {discounts &&
        !isPendingDiscount &&
        discounts.map((discount) => (
          <div key={discount.id} className="w-full bg-red-400 py-8 px-4 mt-2">
            <DiscountSection flashSaleData={discount} />
          </div>
        ))}
    </div>
  );
};

export default HomeContent;
