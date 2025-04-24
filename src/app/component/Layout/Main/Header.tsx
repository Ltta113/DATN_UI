"use client";

import CategoryContent from "app/(pages)/home/components/CategoryContent";
import { useAuth } from "app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          const cart = JSON.parse(storedCart);
          setCartCount(cart.length);
        } catch { }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleSelectCategory = (category: Category) => {
    const isSameCategory = selectedCategory === category.slug;
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim());
    }

    if (isSameCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category.slug);
      params.set("category", category.slug);
    }

    router.push(`/search?${params.toString()}`);
  };

  const navigateToCart = () => {
    router.push("/cart");
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

        {/* RIGHT: Auth & Cart */}
        <div className="flex items-center space-x-4">
          {/* Shopping Cart Button */}
          <button
            onClick={navigateToCart}
            className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 relative"
            aria-label="Shopping cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span className="ml-2 hidden sm:inline-block">Giỏ hàng</span>
            {/* Optional: Add a badge for cart items count */}
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {user ? (
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <Image
                src={user.avatar || "https://res.cloudinary.com/dswj1rtvu/image/upload/v1745051027/BookStore/Authors/istockphoto-1451587807-612x612_f8h3fr.jpg"}
                alt="avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <span className="text-gray-700 hidden sm:inline-block">
                👋 Xin chào, {user.full_name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 cursor-pointer"
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
