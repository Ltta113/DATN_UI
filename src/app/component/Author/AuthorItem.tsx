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
      className="flex flex-col items-center w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-amber-400 mb-3">
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

      <h3 className="text-center text-base font-bold text-gray-800 mb-1">
        {author.name}
      </h3>

      <p className="text-xs text-gray-600 mb-2">{author.book_count} sách</p>

      {author.birth_date && (
        <p className="text-xs text-gray-500 mb-1">
          <span className="font-medium">Ngày sinh:</span>{" "}
          {formatDate(author.birth_date)}
        </p>
      )}

      {author.biography && (
        <p className="text-xs text-gray-600 text-center mt-2 line-clamp-3">
          {author.biography}
        </p>
      )}

      <div className="mt-3 pt-2 border-t border-gray-100 w-full">
        <span className="text-xs text-amber-600 font-medium hover:text-amber-700">
          Xem chi tiết →
        </span>
      </div>
    </Link>
  );
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  } catch {
    return dateString;
  }
};

export default AuthorItem;
