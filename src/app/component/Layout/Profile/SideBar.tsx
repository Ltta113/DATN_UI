"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBookmark,
  FiBookOpen,
  FiUser,
  FiHeadphones,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";
import { BsWallet2 } from "react-icons/bs";
import { useAuth } from "app/context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

  // Hàm kiểm tra đường dẫn active
  const isActive = (href: string) => pathname === href;

  const navItems = [
    { href: "/", label: "Trang chủ", icon: <FiHome size={20} /> },
    { href: "/library", label: "Thư viện của tôi", icon: <FiBookOpen size={20} /> },
    { href: "/bookmarks", label: "Yêu thích", icon: <FiBookmark size={20} /> },
    { href: "/wallet", label: "Ví tiền", icon: <BsWallet2 size={20} /> },
    { href: "/orders", label: "Đơn hàng của tôi", icon: <FiPackage size={20} /> },
    { href: "/profile", label: "Thông tin cá nhân", icon: <FiUser size={20} /> },
    { href: "/notifications", label: "Thông báo của tôi", icon: <FiHeadphones size={20} /> },
  ];

  return (
    <div className="m-2 h-screen flex flex-col justify-between py-8 bg-white w-64 shadow-sm rounded-md">
      <div className="px-6 mb-10">
        <Link href="/">
          <div className="text-2xl font-bold text-orange-500">SachVN</div>
        </Link>
      </div>

      <div className="flex-grow">
        <nav className="px-4">
          <ul className="space-y-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center ${
                    isActive(item.href)
                      ? "text-orange-500 font-medium"
                      : "text-gray-600 hover:text-orange-500"
                  }`}
                >
                  <div className="mr-3">{item.icon}</div>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={logout}
                className="flex cursor-pointer items-center text-gray-600 hover:text-orange-500"
              >
                <FiLogOut className="mr-3" size={20} />
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
