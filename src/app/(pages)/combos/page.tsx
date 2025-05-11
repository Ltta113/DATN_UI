"use client";

import ComboList from "app/component/ComboList/ComboList";
import Loading from "app/component/Loading/Loading";
import { useGetCombos } from "hooks/useGetCombos";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { BiHomeAlt } from "react-icons/bi";

export default function CombosPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams?.get("page")) || 1;

  const { data, isPending, isError, error } = useGetCombos(page);

  if (isPending) return <Loading />;
  if (isError) return <div>{(error as Error).message}</div>;
  if (!data?.data) return <div>Không tìm thấy combo nào</div>;

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
        <span className="text-gray-800 font-medium">Combo</span>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Danh sách combo</h1>
        <ComboList
          combos={data.data}
          pagination={data.pagination}
          currentPage={page}
        />
      </div>
    </div>
  );
}
