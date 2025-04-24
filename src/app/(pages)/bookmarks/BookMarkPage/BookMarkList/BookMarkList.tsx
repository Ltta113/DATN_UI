"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from 'app/lib/books';
import Loading from 'app/component/Loading/Loading';

interface BookmarkListProps {
    title: string;
    bookmarks: Book[];
    isLoading?: boolean;
}

const BookmarkList = ({ title, bookmarks, isLoading }: BookmarkListProps) => {
    let content;

    if (isLoading) {
        content = (
            <div className="text-center py-8">
                <Loading />
            </div>
        );
    } else if (!bookmarks || bookmarks.length === 0) {
        content = (
            <div className="text-center py-8">
                <p className="text-gray-500">Không có sách nào được tìm thấy</p>
            </div>
        );
    } else {
        content = (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
                {bookmarks.map((book) => (
                    <Link href={`/books/${book.slug}`} key={book.id}>
                        <div className="flex flex-col items-center hover:opacity-90 transition-opacity">
                            <div className="relative w-full h-56 overflow-hidden rounded-lg shadow-md mb-2">
                                <Image
                                    src={book.cover_image}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-sm font-medium text-left text-gray-800 mt-2 w-full line-clamp-1">{book.title}</h3>
                            <p className="text-xs text-gray-600 text-left w-full line-clamp-1">
                                {book.authors.map((author, index) => (
                                    <span key={author.id}>
                                        {author.name}
                                        {index < book.authors.length - 1 && ', '}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-bold mb-4 text-left">{title}</h2>
            {content}
        </div>
    );
};


export default BookmarkList;