"use client";

import CategoryContent from "app/(pages)/home/components/CategoryContent";
import { useAuth } from "app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Category } from "app/lib/books";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (selectedCategory) params.set("category", selectedCategory);

    router.push(`/search?${params.toString()}`);
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category.slug);

    // Optional: nếu muốn filter ngay khi chọn category mà không cần submit
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("query", searchQuery.trim());
    params.set("category", category.slug);
    router.push(`/search?${params.toString()}`);
  };

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <header className="bg-white shadow-xl py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
        {/* LEFT */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <span className="text-2xl font-bold text-orange-500">SachVN</span>
          </Link>
          <Link
            href="/trang-chu"
            className="flex items-center text-gray-700 hover:text-orange-500"
          >
            <span className="mr-2">🏠</span>
            <span>Trang chủ</span>
          </Link>
        </div>

        {/* CENTER: Search box */}
        <form
          onSubmit={handleSearch}
          className="relative flex-1 max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Tên sách, tác giả..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </form>

        {/* RIGHT: Auth */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt="avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <span className="text-gray-700 hidden sm:inline-block">
                👋 Xin chào, {user.full_name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
            >
              <span className="mr-2">👤</span>
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <main className="container mx-auto w-[80%]">
        <div className="flex flex-col items-center">
          <CategoryContent
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
        </div>
      </main>
    </header>
  );
}
