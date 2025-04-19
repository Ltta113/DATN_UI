"use client";

import ScrollableCategories from "app/component/CategoryItem/HomeCategory/ScrollableCategories";
import Loading from "app/component/Loading/Loading";
import { Category } from "app/lib/books";
import { useGetCategories } from "hooks/useGetCategories";

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: Category) => void;
}

export default function CategoryContent({
  selectedCategory,
  onSelectCategory,
}: Props) {
  const { data, isLoading, isError } = useGetCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Không thể tải thể loại.
      </div>
    );
  }

  return (
    <ScrollableCategories
      categories={data.data as Category[]}
      selectedCategory={selectedCategory}
      onSelectCategory={onSelectCategory}
    />
  );
}
