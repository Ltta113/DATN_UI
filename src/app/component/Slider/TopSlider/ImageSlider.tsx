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

    const books = data?.data as Book[];

    const totalVisibleSlides = 3;
    const maxIndex = Math.max(0, 5 - totalVisibleSlides);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex >= maxIndex) {
                return 0;
            }
            return prevIndex + 1;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex <= 0) {
                return maxIndex;
            }
            return prevIndex - 1;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            handleNext();
        }
    };

    const getCenterPosition = (index: number): boolean => {
        const visibleIndex: number = index - currentIndex;
        return visibleIndex === 1;
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (!isPaused) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    return nextIndex > maxIndex ? 0 : nextIndex;
                });
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [isPaused, maxIndex]);

    return (
        <div
            className="flex items-center justify-center relative w-full"
            onMouseEnter={() => {
                setIsHovered(true);
                setIsPaused(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsPaused(false);
            }}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onKeyDown={handleKeyDown}
            aria-label="Book slider"
        >
            <button
                onClick={handlePrev}
                className={`absolute left-4 z-20 bg-black/50 p-2 rounded-full transition-opacity duration-300 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                aria-label="Previous book"
            >
                <FiChevronLeft className="text-white" size={40} />
            </button>

            <div className="flex overflow-hidden w-full">
                {/* {isPending ? (
                    <div className="flex w-full">
                        {[...Array(3)].map((book, index) => (
                            <div
                                key={`placeholder-${index}`}
                                className={`flex-1 bg-gray-300 animate-pulse h-48 ${index !== 2 ? 'mr-2' : ''}`}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                ) : ( */}
                <div
                    className="flex transition-transform duration-500 ease-in-out w-full"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / totalVisibleSlides)}%)`,
                        width: `${5 * (100 / totalVisibleSlides)}%`
                    }}
                    aria-live="polite"
                >
                    {books?.map((book: Book, index: number) => (
                        <div key={book.id}>
                            <BookSlide
                                key={book.id}
                                book={book}
                                isActive={index >= currentIndex && index < currentIndex + totalVisibleSlides}
                                isCentered={getCenterPosition(index)}
                            />
                        </div>
                    ))}
                </div>
                {/* )} */}
            </div>

            <button
                onClick={handleNext}
                className={`absolute right-4 z-20 bg-black/50 p-2 rounded-full transition-opacity duration-300 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                aria-label="Next book"
            >
                <FiChevronRight className="text-white" size={40} />
            </button>
        </div>
    );
};

export default BookSlider;