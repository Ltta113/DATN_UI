import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from 'app/lib/books';

interface BookCardProps {
    book: Book;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

const BookCard = ({ book }: BookCardProps) => {
    return (
        <Link href={`/books/${book.slug}`}>
            <div className="flex flex-col items-center transition-transform hover:scale-105">
                <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-md mb-2">
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
                {book.price && (
                    <p className="text-sm font-bold text-amber-600 text-left w-full mt-1">
                        {formatPrice(Number(book.price))}
                    </p>
                )}
            </div>
        </Link>
    );
};

export default BookCard;