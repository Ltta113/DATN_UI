"use client";

import React from "react";
import Link from "next/link";
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
            <li>
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-orange-500"
              >
                <FiHome className="mr-3" size={20} />
                <span>Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link
                href="/library"
                className="flex items-center text-gray-600 hover:text-orange-500"
              >
                <FiBookOpen className="mr-3" size={20} />
                <span>Thư viện của tôi</span>
              </Link>
            </li>
            <li>
              <Link
                href="/bookmarks"
                className="flex items-center text-gray-600 hover:text-orange-500"
              >
                <FiBookmark className="mr-3" size={20} />
                <span>Đánh dấu</span>
              </Link>
            </li>
            <li>
              <Link
                href="/wallet"
                className="flex items-center text-gray-600 hover:text-orange-500"
              >
                <BsWallet2 className="mr-3" size={20} />
                <span>Ví tiền</span>
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="flex items-center text-gray-600 hover:text-orange-500"
              >
                <FiPackage className="mr-3" size={20} />
                <span>Đơn hàng của tôi</span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center text-orange-500 font-medium"
              >
                <FiUser className="mr-3" size={20} />
                <span>Thông tin cá nhân</span>
              </Link>
            </li>
            <li>
              <Link
                href="/support"
                className="flex items-center text-gray-600 hover:text-orange-500"
              >
                <FiHeadphones className="mr-3" size={20} />
                <span>Liên hệ hỗ trợ</span>
              </Link>
            </li>
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
