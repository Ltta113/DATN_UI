import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface Combo {
  id: number;
  name: string;
  image: string;
  price: number;
  discount?: string | number;
  slug?: string;
}

interface BookCombosProps {
  combos: Combo[];
}

const BookCombos: React.FC<BookCombosProps> = ({ combos }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const combosPerPage = 4;
  const totalPages = Math.ceil(combos.length / combosPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const startIndex = currentPage * combosPerPage;
  const endIndex = startIndex + combosPerPage;
  const currentCombos = combos.slice(startIndex, endIndex);

  if (!combos.length) return null;

  return (
    <div className="bg-gray-100 rounded-lg shadow-md px-4 py-8 mx-4 mt-6">
      <h2 className="text-xl font-semibold mb-6">Combo liên quan</h2>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentCombos.map((combo) => (
            <Link
              key={combo.id}
              href={`/combos/${combo.slug || combo.id}`}
              className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={combo.image}
                  alt={combo.name}
                  fill
                  className="object-cover"
                />
                {combo.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                    Giảm {Math.round(100 - Number(combo.discount))}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{combo.name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-orange-500 font-semibold">
                    {Math.round(combo.price).toLocaleString('vi-VN')} đ
                  </p>
                  {combo.discount && (
                    <>
                      <p className="text-gray-500 line-through text-sm">
                        {Math.round(combo.price * (1 + Number(combo.discount) / 100)).toLocaleString('vi-VN')} đ
                      </p>
                      <p className="text-green-600 text-sm">
                        Tiết kiệm {Math.round(combo.price * Number(combo.discount) / 100).toLocaleString('vi-VN')} đ
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={handlePrevPage}
              className="p-2 cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <IoChevronBack size={20} />
            </button>
            <span className="flex items-center">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className="p-2 cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <IoChevronForward size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCombos; 