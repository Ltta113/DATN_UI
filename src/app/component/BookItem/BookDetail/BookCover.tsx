import React from "react";
import Image from "next/image";
import { Book } from "app/lib/books";

const BookCover = ({ book }: { book: Book }) => {
  return (
    <div className="flex justify-center md:justify-start">
      <div className="w-48 h-64 relative rounded-lg overflow-hidden shadow-lg">
        <Image
          src={book.cover_image}
          alt="Become a freelancer to achieve freedom"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default BookCover;
