"use client";

import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BookSlide from "./ImageSlide";
import { Book } from "app/lib/books";

const useGetWeeklyTopBooks = () => {
    const fakeBooks: Book[] = [
        {
            id: 1,
            title: "The Midnight Library",
            slug: "the-midnight-library",
            author: "Matt Haig",
            rating: 4.5,
            coverImage: "https://picsum.photos/id/24/600/900"
        },
        {
            id: 2,
            title: "Atomic Habits",
            slug: "atomic-habits",
            author: "James Clear",
            rating: 4.8,
            coverImage: "https://picsum.photos/id/25/600/900"
        },
        {
            id: 3,
            title: "Project Hail Mary",
            slug: "project-hail-mary",
            author: "Andy Weir",
            rating: 4.7,
            coverImage: "https://picsum.photos/id/26/600/900"
        },
        {
            id: 4,
            title: "The Invisible Life of Addie LaRue",
            slug: "the-invisible-life-of-addie-larue",
            author: "V.E. Schwab",
            rating: 4.3,
            coverImage: "https://picsum.photos/id/29/600/900"
        },
        {
            id: 5,
            title: "Klara and the Sun",
            slug: "klara-and-the-sun",
            author: "Kazuo Ishiguro",
            rating: 4.1,
            coverImage: "https://picsum.photos/id/28/600/900"
        }
    ];

    return {
        data: fakeBooks,
        isLoading: false
    };
};

const BookSlider = () => {
    const { data: books, isLoading } = useGetWeeklyTopBooks();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const totalVisibleSlides = 3;
    const maxIndex = books?.length ? Math.max(0, books.length - totalVisibleSlides) : 0;

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

        if (!isPaused && books?.length) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    return nextIndex > maxIndex ? 0 : nextIndex;
                });
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [books?.length, isPaused, maxIndex]);

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
                {isLoading ? (
                    <div className="flex w-full">
                        {[...Array(3)].map((book, index) => (
                            <div
                                key={book.id}
                                className={`flex-1 bg-gray-300 animate-pulse h-48 ${index !== 2 ? 'mr-2' : ''}`}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="flex transition-transform duration-500 ease-in-out w-full"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / totalVisibleSlides)}%)`,
                            width: `${books?.length * (100 / totalVisibleSlides)}%`
                        }}
                        aria-live="polite"
                    >
                        {books?.map((book, index) => (
                            <BookSlide
                                key={book.id}
                                book={book}
                                index={index}
                                isActive={index >= currentIndex && index < currentIndex + totalVisibleSlides}
                                isCentered={getCenterPosition(index)}
                            />
                        ))}
                    </div>
                )}
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