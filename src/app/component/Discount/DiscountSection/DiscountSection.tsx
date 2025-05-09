import BookCards from "app/component/BookList/BookList5/BookList5";
import { Discount } from "app/lib/books";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface FlashSaleBannerProps {
  flashSaleData?: Discount;
}

export default function DiscountSection({
  flashSaleData,
}: FlashSaleBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const router = useRouter();

  useEffect(() => {
    // If we have actual data, use the expires_at date
    // Otherwise set a demo countdown for display purposes
    const endTime = flashSaleData
      ? new Date(flashSaleData.expires_at).getTime()
      : new Date().getTime() + 5 * 60 * 60 * 1000; // 5 hours from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSaleData]);

  // Format number to always have 2 digits
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <div className="bg-red-400 rounded-lg mb-4">
      <div className="flex-row items-center justify-between mb-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-md">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-red-500">
              {flashSaleData?.name || "Khuyến mãi đặc biệt"}
            </h2>
            <div className="ml-4 text-gray-700 flex">
              Kết thúc trong
              <div className="flex items-center ml-2">
                <div className="bg-black text-white px-2 py-1 rounded text-center mx-0.5 w-8">
                  {formatNumber(timeLeft.hours)}
                </div>
                <span className="mx-0.5 text-black">:</span>
                <div className="bg-black text-white px-2 py-1 rounded text-center mx-0.5 w-8">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <span className="mx-0.5 text-black">:</span>
                <div className="bg-black text-white px-2 py-1 rounded text-center mx-0.5 w-8">
                  {formatNumber(timeLeft.seconds)}
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              router.push(`/discount/${flashSaleData?.id}`);
            }}
            className="text-blue-500 flex items-center cursor-pointer"
          >
            Xem tất cả
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="bg-red-400">
          <BookCards books={flashSaleData?.books || []} />
        </div>
      </div>
    </div>
  );
}
