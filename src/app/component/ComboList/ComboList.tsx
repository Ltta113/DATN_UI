import { Combo } from "app/component/Payment/OrderSummery/OrderSummery";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ComboListProps {
  combos: Combo[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  currentPage: number;
}

const ComboList: React.FC<ComboListProps> = ({ combos, pagination, currentPage }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {combos.map((combo) => (
          <Link
            key={combo.id}
            href={`/combos/${combo.slug}`}
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
                  <p className="text-gray-500 line-through text-sm">
                    {Math.round(combo.price * (1 + Number(combo.discount) / 100)).toLocaleString('vi-VN')} đ
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => {
              if (currentPage > 1) {
                window.location.href = `/combos?page=${currentPage - 1}`;
              }
            }}
            disabled={currentPage === 1}
            className="p-2 cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoChevronBack size={20} />
          </button>
          <span className="flex items-center">
            {currentPage} / {pagination.last_page}
          </span>
          <button
            onClick={() => {
              if (currentPage < pagination.last_page) {
                window.location.href = `/combos?page=${currentPage + 1}`;
              }
            }}
            disabled={currentPage === pagination.last_page}
            className="p-2 cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoChevronForward size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ComboList; 