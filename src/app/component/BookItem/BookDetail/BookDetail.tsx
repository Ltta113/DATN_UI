import React from "react";
import Link from "next/link";
import { FiFlag, FiSend, FiShoppingBag, FiStar } from "react-icons/fi";
import { Book } from "app/lib/books";

const BookDetails = ({ book }: { book: Book }) => {
  const formatRating = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-6 text-left">{book.title}</h1>

      <div className="space-y-3">
        <DetailRow
          label="Tác giả"
          value={
            <>
              {book.authors.map((author, index) => (
                <span key={author.id}>
                  <Link
                    href={`/authors/${author.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {author.name}
                  </Link>
                  {index < book.authors.length - 1 && ", "}
                </span>
              ))}
            </>
          }
        />
        <DetailRow
          label="Danh mục"
          value={
            <>
              {book.categories.map((category, index) => (
                <span key={category.id}>
                  <Link
                    href={`/search?category=${category.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {category.name}
                  </Link>
                  {index < book.categories.length - 1 && ", "}
                </span>
              ))}
            </>
          }
        />
        <DetailRow label="Số trang" value={book.page_count.toString()} />
      </div>

      <div className="border-t border-b border-gray-200 my-6 py-4">
        <div className="flex justify-start items-center">
          <span className="mr-2">
            Rating: {formatRating.format(book.star_rating ?? 0)}
          </span>
          <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-gray-600 pl-1">
            ({book.reviews.length} đánh giá)
          </span>
        </div>
      </div>

      <div className="flex justify-start gap-4">
        <ActionButton icon={<FiSend />} label="Send" />
        <ActionButton icon={<FiShoppingBag />} label="Buy" />
        <ActionButton icon={<FiFlag />} label="Flag" />
      </div>

      {book.description && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-800 leading-relaxed text-left">
            {book.description}
          </p>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex justify-start items-center flex-wrap">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-500">{value}</span>
    </div>
  );
};

const ActionButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <button
      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default BookDetails;
