"use client";

import { useAuth } from "app/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header className="bg-white shadow-xl py-4">
      <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
        {/* LEFT: Logo + Trang chủ */}
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
        <div className="relative flex-1 max-w-md mx-auto">
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
        </div>

        {/* RIGHT: Auth controls */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="avatar"
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
    </header>
  );
}
