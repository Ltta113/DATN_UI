'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Book } from 'app/lib/books';

interface BookSlideProps {
    book: Book;
    isActive: boolean;
    isCentered: boolean;
}

const BookSlide = ({ book, isActive, isCentered }: BookSlideProps) => {
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
            className={`cursor-pointer transition-all duration-500 relative
        ${isActive ? 'opacity-100' : 'opacity-80'} 
        w-full hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={() => router.push(`/books/${book.slug}`)}
            onKeyDown={handleKeyDown}
            aria-label={`Book: ${book.title} by ${book.authors.map(author => author.name).join(', ')}`}
        >
            <div
                className={`relative w-full ${isCentered ? 'h-96' : 'h-80'} group`}
                title={book.title}
            >
                <Image
                    src={
                        book.cover_image ||
                        'https://res.cloudinary.com/dswj1rtvu/image/upload/v1745050814/BookStore/Books/no_cover_available_bjb33v.png'
                    }
                    alt={`Book cover for ${book.title}`}
                    fill
                    className="rounded-lg object-cover"
                />
                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-3 rounded-b-lg">
                    <h6
                        className={`text-white font-semibold truncate ${isCentered ? 'text-xl' : 'text-lg'}`}
                    >
                        {book.title}
                    </h6>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-white text-sm truncate max-w-[70%]">
                            {book.authors.map((author) => author.name).join(', ')}
                        </p>
                        <div className="flex items-center text-sm text-yellow-400">
                            <span className="mr-1">★</span>
                            <span className="text-white">5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookSlide;