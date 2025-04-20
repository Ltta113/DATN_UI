"use client";

import Loading from "app/component/Loading/Loading";
import AuthorsList from "app/component/Search/AuthorList";
import BookResultList from "app/component/Search/BookResultList";
import { useSearchResult } from "hooks/useGetSearchResult";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiHomeAlt } from "react-icons/bi";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams?.get("query") || "";
  const category = searchParams?.get("category") || "";
  const page = parseInt(searchParams?.get("page") || "1", 10);

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const { data, isLoading, isPending } = useSearchResult(
    debouncedQuery,
    category,
    page
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const handlePageChange = (newPage: number) => {
    router.push(
      `/search?query=${debouncedQuery}&category=${category}&page=${newPage}`
    );
  };

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
        <Link
          href="/books"
          className="text-gray-600 hover:text-orange-500 flex items-center"
        >
          <span>Sách</span>
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        {debouncedQuery && (
          <span className="text-gray-800 font-medium">Kết quả tìm kiếm</span>
        )}
        {!debouncedQuery && category && (
          <span className="text-gray-800 font-medium">Danh mục</span>
        )}
      </div>
      {debouncedQuery && (
        <h1 className="text-3xl font-bold mb-8 text-center">
          Kết quả tìm kiếm cho &quot;{debouncedQuery}&quot;
        </h1>
      )}
      {debouncedQuery && (
        <div className="container mx-auto py-8 pl-10 pr-10">
          <h1 className="text-2xl font-bold mb-8">Tác giả liên quan</h1>
          <AuthorsList
            authors={Array.isArray(data?.data.authors) ? data.data.authors : []}
          />
        </div>
      )}
      {isLoading || (isPending && debouncedQuery) ? (
        <Loading />
      ) : (
        <BookResultList
          books={data?.data.books}
          currentPage={data?.pagination.current_page}
          totalPages={data?.pagination.last_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
