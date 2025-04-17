"use client";

import { Category } from "app/lib/books";
import { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ScrollableCategoriesProps {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
  selectedCategory?: string;
}

const ScrollableCategories = ({
  categories,
  onSelectCategory,
  selectedCategory,
}: ScrollableCategoriesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkForArrows = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // Check if content width exceeds container width
    const hasOverflow = scrollWidth > clientWidth;

    // Check if we're at the leftmost position
    const isAtLeftEdge = scrollLeft <= 0;

    // Check if we're at the rightmost position
    const isAtRightEdge = Math.abs(scrollLeft + clientWidth - scrollWidth) < 10;

    // Show left arrow if we're not at the left edge and there's overflow
    setShowLeftArrow(hasOverflow && !isAtLeftEdge);

    // Show right arrow if we're not at the right edge and there's overflow
    setShowRightArrow(hasOverflow && !isAtRightEdge);
  };

  useEffect(() => {
    const checkVisibility = () => {
      if (!scrollRef.current || !containerRef.current) return;

      // Check if all items are visible
      const totalCategoriesWidth = Array.from(
        scrollRef.current.children
      ).reduce(
        (total, child) => total + child.getBoundingClientRect().width,
        0
      );

      const containerWidth = containerRef.current.getBoundingClientRect().width;

      // If total width of categories exceeds container width, we need arrows
      if (totalCategoriesWidth > containerWidth) {
        setShowRightArrow(true);
      }

      checkForArrows();
    };

    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }

    const timeout = setTimeout(() => {
      checkVisibility();
    }, 100);

    window.addEventListener("resize", checkForArrows);
    return () => {
      window.removeEventListener("resize", checkForArrows);
      clearTimeout(timeout);
    };
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 300;
    const newScrollLeft =
      direction === "left"
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });

    setTimeout(checkForArrows, 300);
  };

  const handleScroll = () => {
    checkForArrows();
  };

  return (
    <div ref={containerRef} className="relative flex items-center w-full">
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md cursor-pointer"
          aria-label="Scroll left"
        >
          <FiChevronLeft size={20} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex items-center w-full overflow-x-auto px-2 py-4 scroll-smooth no-scrollbar"
        onScroll={handleScroll}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex-shrink-0 px-4 py-2 mx-1 text-sm font-medium rounded-md cursor-pointer whitespace-nowrap ${
              selectedCategory === category.slug
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => onSelectCategory && onSelectCategory(category)}
          >
            {category.name}
          </div>
        ))}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md cursor-pointer"
          aria-label="Scroll right"
        >
          <FiChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export default ScrollableCategories;
