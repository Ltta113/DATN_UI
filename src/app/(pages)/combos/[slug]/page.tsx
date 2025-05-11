"use client";

import Loading from "app/component/Loading/Loading";
import { useGetComboBySlug } from "hooks/useGetComboBySlug";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ComboDetail from "./components/ComboDetail";
import ComboPriceCard from "./components/ComboPriceCard";
import Link from "next/link";
import { BiHomeAlt } from "react-icons/bi";
import ProductReview from "app/component/Rating/ProductReview";
import { useAuth } from "app/context/AuthContext";

export default function ComboDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();

  const [prevSlug, setPrevSlug] = useState(slug);
  const [isChangingSlug, setIsChangingSlug] = useState(false);

  const { data, isPending, isError, error, refetch } = useGetComboBySlug(slug);

  useEffect(() => {
    if (slug !== prevSlug) {
      setIsChangingSlug(true);
      setPrevSlug(slug);

      refetch().finally(() => {
        setIsChangingSlug(false);
      });
    }
  }, [slug, prevSlug, refetch]);

  const isLoading = isPending || isChangingSlug;

  const reviewData = data?.data?.reviews.find(
    (review) => review.user.id === user?.id
  );

  return (
    <div className="container mx-auto py-8 w-[80%] mx-auto">
      <div className="flex items-center mb-6">
        <Link
          href="/"
          className="text-gray-600 hover:text-orange-500 flex items-center"
        >
          <BiHomeAlt className="mr-2" />
          Trang chủ
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/combos" className="text-gray-600 hover:text-orange-500">
          Combo
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800 font-medium">
          {data?.data?.name || "Chi tiết combo"}
        </span>
      </div>

      {(() => {
        if (isError) {
          return (
            <div className="container mx-auto py-8 text-center">
              <p className="text-red-500">
                {(error as Error)?.message ||
                  "Có lỗi xảy ra, vui lòng thử lại sau."}
              </p>
            </div>
          );
        } else if (isLoading) {
          return <Loading />;
        } else if (!data?.data) {
          return (
            <div className="container mx-auto py-8 text-center">
              <p className="text-gray-500">Không tìm thấy combo</p>
            </div>
          );
        } else {
          return (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                  <ComboDetail combo={data.data} />
                </div>
                <div className="lg:w-1/3">
                  <ComboPriceCard combo={data.data} />
                </div>
              </div>
              <div>
                <div className="bg-gray-100 rounded-lg shadow-md px-4 py-8 mx-4 mt-6">
                  <ProductReview
                    reviews={data.data.reviews}
                    reviewableType="combo"
                    reviewableId={data.data.id}
                    slug={data.data.slug}
                    start_rating={data.data.star_rating}
                    dataReview={reviewData}
                  />
                </div>
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
}
