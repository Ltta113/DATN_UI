"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthorResultList from "app/component/Author/AuthorList";
import { Author } from "app/lib/books";
import { useGetAuthor } from "hooks/useGetAuthor";
import Loading from "app/component/Loading/Loading";

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
