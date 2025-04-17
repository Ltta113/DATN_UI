'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Book } from 'app/lib/books';

interface BookSlideProps {
    book: Book;
    index: number;
    isActive: boolean;
    isCentered: boolean;
}

const BookSlide = ({ book, index, isActive, isCentered }: BookSlideProps) => {
    const router = useRouter();

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            router.push(`/books/${book.id}`);
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className={`cursor-pointer flex-none transition-all duration-500 mx-2.5 relative mt-5
        ${isActive ? 'opacity-100' : 'opacity-80'} w-[calc(30%+15px)] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={() => router.push(`/books/${book.id}`)}
            onKeyDown={handleKeyDown}
            aria-label={`Book: ${book.title} by ${book.author}`}
        >
            <div className={`relative w-full h-48 group ${isCentered ? 'h-56' : 'h-48 mt-2'}`} title={book.title}>
                <Image
                    src={book.coverImage}
                    alt={`Book cover for ${book.title}`}
                    fill
                    className="rounded-lg object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-center px-2.5 py-2">
                    <h6 className={`text-white font-semibold truncate ${isCentered ? 'text-xl' : 'text-lg'}`}>
                        {book.title}
                    </h6>
                    <div className="flex justify-between items-center">
                        <p className="text-white text-sm">
                            {book.author}
                        </p>
                        <div className="flex items-center">
                            <span className="text-yellow-400 mr-1" aria-hidden="true">★</span>
                            <span className="text-white text-sm">{book.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default BookSlide;
