import Image from "next/image";
import StarRating from "./StarRating";
import { Book } from "app/lib/books";

const BookCard = ({ book }: { book: Book }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer w-[250px]">
      <div className="h-64 w-48 relative shadow-2xl mb-2 overflow-hidden rounded-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl">
        <Image
          src={book.cover_image}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>
      <StarRating rating={4} />
      <h3 className="mt-2 text-sm font-bold text-center max-w-sm mx-auto break-words">
        {book.title}
      </h3>

      <p className="text-gray-600 text-xs text-center w-full">
        {book.authors.map((author) => author.name).join(", ")}
      </p>
    </div>
  );
};

export default BookCard;
