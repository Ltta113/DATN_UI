"use client";

import { Author, Book } from "app/lib/books";
import { useGetAuthorBySlug } from "hooks/useGetAuthorBySlug";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  useSearchParams,
  useRouter,
  useParams,
  usePathname,
} from "next/navigation";
import BookResultList from "app/component/Search/BookResultList";
import Loading from "app/component/Loading/Loading";
import Link from "next/link";
import { BiHomeAlt } from "react-icons/bi";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

interface AuthorResponse {
  author: Author;
  books: Book[];
}

export default function AuthorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const slug = params?.slug as string;

  const page = parseInt(searchParams?.get("page") || "1", 10);
  const [prevPage, setPrevPage] = useState(page);
  const [isChangingPage, setIsChangingPage] = useState(false);

  const { data, isPending, isError, error, refetch } = useGetAuthorBySlug(
    slug,
    page
  );

  const author = (data?.data as AuthorResponse)?.author || null;

  useEffect(() => {
    if (page !== prevPage) {
      setIsChangingPage(true);
      setPrevPage(page);
      refetch().finally(() => setIsChangingPage(false));
    }
  }, [page, prevPage, refetch]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isPending || isChangingPage) return <Loading />;
  if (isError) return <div>{(error as Error).message}</div>;
  if (!author) return <div>Không tìm thấy tác giả</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
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
            <Link
              href="/authors"
              className="text-gray-600 hover:text-orange-500 flex items-center"
            >
              <span>Tác giả</span>
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{author.name}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/4 p-6 flex justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-100">
                <Image
                  src={
                    author?.photo ||
                    "https://res.cloudinary.com/dswj1rtvu/image/upload/v1745051027/BookStore/Authors/istockphoto-1451587807-612x612_f8h3fr.jpg"
                  }
                  alt={author.name}
                  className="w-full h-full object-cover"
                  fill
                  sizes="192px"
                />
              </div>
            </div>
            <div className="md:w-3/4 p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {author.name}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <span className="mr-6">
                  <span className="font-medium">Ngày sinh:</span>{" "}
                  {formatDate(author?.birth_date)}
                </span>
                <span>
                  <span className="font-medium">Số sách xuất bản:</span>{" "}
                  {author.book_count}
                </span>
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Tiểu sử
                </h2>
                <p className="text-gray-600">
                  {author.biography ||
                    "Chưa có thông tin tiểu sử cho tác giả này."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <BookResultList
          message={`Sách của tác giả ${author.name}`}
          books={(data?.data as AuthorResponse)?.books}
          currentPage={data?.pagination?.current_page ?? 1}
          totalPages={data?.pagination?.last_page ?? 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
