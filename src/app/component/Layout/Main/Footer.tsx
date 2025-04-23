"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetCategories } from "hooks/useGetCategories";
import { useNewestBooks } from "hooks/useGetNewestBook";
import { Book } from "app/lib/books";
import { usePathname } from "next/navigation";
import Loading from "app/component/Loading/Loading";

interface Category {
  slug: string;
  name: string;
}

const Footer: React.FC = () => {
  const { data, isLoading, isError } = useGetCategories();
  const {
    data: dataBook,
    isPending: isBookPending,
    isError: isBookError,
  } = useNewestBooks();

  const books = (dataBook?.data ?? []) as Book[];

  const categories = (data?.data ?? []) as Category[];

  const categoriesToDisplay = categories.slice(0, 5);
  const booksToDisplay = books.slice(0, 5);

  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <footer className="relative w-full bg-gradient-to-b from-transparent to-gray-800 text-white py-12 mt-auto">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-full h-full bg-[url('/images/book-background.jpg')] bg-cover bg-center opacity-40"></div>
      </div>

      <div className="container mx-auto relative z-10 px-4 bottom-0 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="text-left">
            <h3 className="text-amber-400 text-xl mb-4 font-bold">
              Danh mục đề xuất
            </h3>
            <ul className="space-y-2">
              {isLoading ? (
                <Loading />
              ) : isError ? (
                <li>Lỗi khi tải danh mục.</li>
              ) : (
                categoriesToDisplay.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/search?category=${category.slug}`}
                      className="hover:text-amber-300"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="text-left">
            <h3 className="text-amber-400 text-xl mb-4 font-bold">
              Sách đề xuất
            </h3>
            <ul className="space-y-2">
              {isBookPending ? (
                <Loading />
              ) : isBookError ? (
                <li>Lỗi khi tải danh mục.</li>
              ) : (
                booksToDisplay.map((book) => (
                  <li key={book.slug}>
                    <Link
                      href={`/books/${book.slug}`}
                      className="hover:text-amber-300"
                    >
                      {book.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Cột SachVn */}
          <div className="text-right">
            <h3 className="text-amber-400 text-xl mb-4 font-bold">SachVn</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-amber-300">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-amber-300">
                  Liên hệ hỗ trợ
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-amber-300">
                  Hướng dẫn
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-amber-300">
                  Gửi phản hồi và đề xuất
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-300">
                  Đăng nhập và đăng ký nhà xuất bản
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Thông tin footer */}
        <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg mb-8 text-left">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/5 mb-4 md:mb-0">
              <Image
                src="/images/satira-logo.png"
                alt="Satira Logo"
                width={150}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="md:w-4/5 text-sm leading-relaxed">
              <p>
                Trang web SachVn là một nguồn tài nguyên toàn diện để tải xuống
                sách điện tử và sách nói. Với việc cung cấp một bộ sưu tập đa
                dạng các cuốn sách phổ biến và được yêu thích trong nhiều danh
                mục khác nhau, SachVn mang đến cho những người yêu sách cơ hội
                tiếp cận nội dung mà họ mong muốn một cách dễ dàng. Với SachVn,
                thế giới sách luôn trong tầm tay bạn!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center py-4 text-sm border-t border-gray-600">
          <p>Tất cả quyền thuộc về trang web SachVN. © 1404</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
