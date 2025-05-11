import { Book } from "app/lib/books";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  book: Book;
};

export default function BookDetail({ book }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Parse image gallery from string to array if it exists
  let galleryImages: { url: string; public_id: string }[] = [];
  try {
    if (book.images) {
      galleryImages =
        typeof book.images === "string" ? JSON.parse(book.images) : book.images;
    }
  } catch (error) {
    console.error("Error parsing image gallery:", error);
  }

  // Create carousel images array with cover image first, then gallery images
  const carouselImages = [
    { url: book.cover_image, title: book.title },
    ...galleryImages.map((img) => ({
      url: img.url,
      title: book.title,
    })),
  ];

  // Format price with Vietnamese currency
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(book.price));

  const formattedFinalPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(book.final_price));

  // Function to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FiStar key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <FiStar className="w-5 h-5 text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<FiStar key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const handleAuthorClick = (authorSlug: string) => {
    router.push(`/authors/${authorSlug}`);
  };

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/search?category=${categorySlug}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Image Carousel */}
        <div className="col-span-1 relative">
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
            {carouselImages.length > 0 && (
              <Image
                width={800}
                height={800}
                src={
                  carouselImages[currentImageIndex]?.url || "/placeholder.png"
                }
                alt={book.title}
                className="w-full h-full object-contain"
              />
            )}

            {carouselImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        currentImageIndex === index
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </div>

          {carouselImages.length > 1 && (
            <div className="flex mt-2 gap-2 overflow-x-auto">
              {carouselImages.map((image, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                    currentImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    width={64}
                    height={64}
                    src={image.url || "/placeholder.png"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Middle Column - Main Info */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex flex-col h-full">
            {/* Basic Details */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {book.title}
              </h1>

              <div className="flex items-center mt-2">
                <div className="flex">
                  {renderStars(Number(book.star_rating) || 0)}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({Number(book.star_rating)?.toFixed(1) || 0} đánh giá)
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-600">
                  Đã bán: {book.sold || 0}
                </span>
                {book.stock > 0 && (
                  <>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-sm text-green-600">
                      Còn hàng: {book.stock}
                    </span>
                  </>
                )}
              </div>

              {/* Authors and Categories */}
              <div className="mt-3">
                {book.authors && book.authors.length > 0 && (
                  <div className="flex flex-wrap items-center text-sm">
                    <span className="text-gray-600 mr-1">Tác giả:</span>
                    {book.authors.map((author, index) => (
                      <span key={author.id}>
                        <span
                          className="text-blue-600 hover:underline cursor-pointer pl-1"
                          onClick={() => handleAuthorClick(author.slug)}
                        >
                          {author.name}
                        </span>
                        {index < book.authors.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                )}

                {book.categories && book.categories.length > 0 && (
                  <div className="flex flex-wrap items-center text-sm mt-1">
                    <span className="text-gray-600 mr-1">Danh mục:</span>
                    {book.categories.map((category, index) => (
                      <span key={category.id}>
                        <span
                          className="text-blue-600 hover:underline cursor-pointer pl-1"
                          onClick={() => handleCategoryClick(category.slug)}
                        >
                          {category.name}
                        </span>
                        {index < book.categories.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                )}

                {book.publisher && (
                  <div className="flex flex-wrap items-center text-sm mt-1">
                    <span className="text-gray-600 mr-1">NXB:</span>
                    <span
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => {
                        if (book.publisher?.slug) {
                          router.push(`/publishers/${book.publisher.slug}`);
                        }
                      }}
                    >
                      {book.publisher.name}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center text-sm mt-1">
                  <span className="text-gray-600 mr-1">ISBN:</span>
                  <span>{book.isbn || "Chưa cập nhật"}</span>
                </div>

                <div className="flex flex-wrap items-center text-sm mt-1">
                  <span className="text-gray-600 mr-1">Số trang:</span>
                  <span>{book.page_count || "Chưa cập nhật"}</span>
                </div>

                <div className="flex flex-wrap items-center text-sm mt-1">
                  <span className="text-gray-600 mr-1">Ngày xuất bản:</span>
                  <span>
                    {book.published_at
                      ? new Date(book.published_at).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-red-600">
                  {formattedFinalPrice}
                </span>
                {Number(book.final_price) !== Number(book.price) && (
                  <>
                    <span className="ml-2 text-lg line-through text-gray-500">
                      {formattedPrice}
                    </span>
                    {book.discount.type === "percent" && (
                      <span className="ml-2 text-red-600 text-sm bg-red-50 px-2 py-1 rounded-full">
                        Giảm {book.discount.value}%
                      </span>
                    )}
                    {book.discount.type === "amount" && (
                      <span className="ml-2 text-red-600 text-sm bg-red-50 px-2 py-1 rounded-full">
                        Giảm{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(book.discount.value))}{" "}
                        VND
                      </span>
                    )}
                  </>
                )}
              </div>

              {book.discount && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-green-600">
                    {book.discount.name}
                  </span>
                  {book.discount.expires_at && (
                    <span>
                      {" "}
                      - Hết hạn:{" "}
                      {new Date(book.discount.expires_at).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-2">Mô tả:</h3>
                <p className="text-gray-600">
                  {book.description || "Không có mô tả."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
