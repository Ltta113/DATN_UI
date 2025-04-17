"use client";

import ScrollableCategories from "app/component/CategoryItem/HomeCategory/ScrollableCategories";
import { Category } from "app/lib/books";
import { useGetCategories } from "hooks/useGetCategories";
import { useState } from "react";

export default function CategoryContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data, isLoading, isError } = useGetCategories();

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category.slug);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đang tải...
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
      onSelectCategory={handleSelectCategory}
    />
  );
}
