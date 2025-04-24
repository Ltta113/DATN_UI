"use client";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BookSlide from "./ImageSlide";
import { Book } from "app/lib/books";
import { useNewestBooks } from "hooks/useGetNewestBook";

const BookSlider = () => {
    const { data } = useNewestBooks(1, 5);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const books = data?.data as Book[] || [];
    const totalVisibleSlides = 3;
    const maxIndex = Math.max(0, books.length - totalVisibleSlides);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex <= 0 ? maxIndex : prevIndex - 1
        );
    };

    const getCenterPosition = (index: number): boolean => {
        const visibleIndex: number = index - currentIndex;
        return visibleIndex === 1;
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isPaused) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex >= maxIndex ? 0 : prevIndex + 1
                );
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isPaused, maxIndex]);

    return (
        <div
            className="relative w-full overflow-hidden py-8"
            onMouseEnter={() => {
                setIsHovered(true);
                setIsPaused(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsPaused(false);
            }}
            onKeyDown={(e) => {
                if (e.key === "ArrowLeft") handlePrev();
                if (e.key === "ArrowRight") handleNext();
            }}
        >
            <button
                onClick={handlePrev}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full transition-opacity duration-300 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isHovered ? "opacity-100" : "opacity-0"
                    }`}
                aria-label="Previous book"
            >
                <FiChevronLeft className="text-white" size={30} />
            </button>
            <div
                className="flex transition-transform duration-500 ease-in-out mx-auto"
                style={{
                    transform: `translateX(-${((45 / totalVisibleSlides) * currentIndex) - (1 * currentIndex)}%)`,
                    width: `${(books.length * 100) / totalVisibleSlides}%`,
                }}
            >
                {books.map((book, index) => (
                    <div
                        key={book.id}
                        className="px-2"
                        style={{ width: `${100 / books.length}%`, flexShrink: 0 }}
                    >
                        <BookSlide
                            book={book}
                            isActive={index >= currentIndex && index < currentIndex + totalVisibleSlides}
                            isCentered={getCenterPosition(index)}
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={handleNext}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full transition-opacity duration-300 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isHovered ? "opacity-100" : "opacity-0"
                    }`}
                aria-label="Next book"
            >
                <FiChevronRight className="text-white" size={30} />
            </button>
        </div>
    );
};

export default BookSlider;