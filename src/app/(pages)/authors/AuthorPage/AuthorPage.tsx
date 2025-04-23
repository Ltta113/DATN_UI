"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthorResultList from "app/component/Author/AuthorList";
import { Author } from "app/lib/books";
import { useGetAuthor } from "hooks/useGetAuthor";
import Loading from "app/component/Loading/Loading";
import Link from "next/link";
import { BiHomeAlt } from "react-icons/bi";

export default function AuthorListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams?.get("page") || "1");

  const [prevPage, setPrevPage] = useState(currentPage);

  const [isChangingPage, setIsChangingPage] = useState(false);

  const { data, isPending, isError, refetch } = useGetAuthor(currentPage);
  const authors = data?.data as Author[];

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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-orange-500 flex items-center"
          >
            <BiHomeAlt className="mr-2" />
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Tác giả</span>
        </div>
      </div>
      {isError ? (
        <p className="text-center">
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
        </p>
      ) : isLoading ? (
        <Loading />
      ) : (
        <AuthorResultList
          authors={authors || []}
          currentPage={data?.pagination?.current_page || currentPage}
          totalPages={data?.pagination?.last_page || 1}
          onPageChange={handlePageChange}
          title="Tác giả nổi bật"
        />
      )}
    </div>
  );
}
