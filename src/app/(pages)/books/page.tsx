"use client";

import Loading from "app/component/Loading/Loading";
import BookResultList from "app/component/Search/BookResultList";
import { Book } from "app/lib/books";
import { useNewestBooks } from "hooks/useGetNewestBook";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiHomeAlt } from "react-icons/bi";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams?.get("page") || "1");

  const [prevPage, setPrevPage] = useState(currentPage);

  const [isChangingPage, setIsChangingPage] = useState(false);

  const { data, isPending, isError, refetch } = useNewestBooks(currentPage);
  const books = data?.data as Book[];

  useEffect(() => {
    if (currentPage !== prevPage) {
      setIsChangingPage(true);
      setPrevPage(currentPage);

      refetch().finally(() => {
        setIsChangingPage(false);
      });
    }
  }, [currentPage, prevPage, refetch]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams || undefined);

    params.set("page", newPage.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const isLoading = isPending || isChangingPage;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link
          href="/"
          className="text-gray-600 hover:text-orange-500 flex items-center"
        >
          <BiHomeAlt className="mr-2" />
          Trang chủ
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800 font-medium">Sách</span>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">
        Danh sách sách mới nhất
      </h1>
      {isError ? (
        <p className="text-center">
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
        </p>
      ) : isLoading ? (
        <Loading />
      ) : (
        <BookResultList
          books={books}
          currentPage={data?.pagination?.current_page ?? 1}
          totalPages={data?.pagination?.last_page ?? 1}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
