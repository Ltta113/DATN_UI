import { Author } from "app/lib/books";
import Image from "next/image";
import Link from "next/link";

interface AuthorCardProps {
  author: Author;
}

const AuthorItem = ({ author }: AuthorCardProps) => {
  return (
    <Link
      href={`/authors/${author.slug}`}
      className="flex flex-col items-center"
    >
      <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-amber-400">
        {author.photo ? (
          <Image
            src={author.photo}
            alt={author.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xl">
              {author.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <h3 className="mt-2 text-center text-sm font-bold">{author.name}</h3>
    <p className="text-xs text-gray-600 rtl:text-right">{author.book_count} sách</p>
    </Link>
  );
};

export default AuthorItem;
