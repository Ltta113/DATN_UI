import React from 'react';
import Link from 'next/link';
import BookCard from './BookCard/BookCard';
import { Book } from 'app/lib/books';
import Loading from 'app/component/Loading/Loading';

export interface BookSectionProps {
    title: string;
    viewAllLink: string;
    books: Book[];
    isLoading?: boolean;
}

const BookSection = ({ title, books, viewAllLink, isLoading }: BookSectionProps) => {

    if (isLoading) {
        return <Loading />;
    }

    // Kiểm tra nếu books có giá trị hợp lệ, nếu không hiển thị thông báo hoặc không làm gì
    if (!books || books.length === 0) {
        return (
            <section className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <Link href={viewAllLink} className="text-sm text-gray-600 hover:text-amber-500 flex items-center">
                        <span>Xem tất cả</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-lg font-bold text-right">{title}</h2>
                </div>
                <p>Không có sách nào.</p>
            </section>
        );
    }

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
                <Link href={viewAllLink} className="text-sm text-gray-600 hover:text-amber-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" transform="rotate(180)" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Xem tất cả</span>
                </Link>
                <h2 className="text-lg font-bold text-right">{title}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 text-left" dir="ltr">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </section>
    );

};

export default BookSection;