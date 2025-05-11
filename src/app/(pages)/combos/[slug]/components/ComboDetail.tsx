import { Combo } from "app/component/Payment/OrderSummery/OrderSummery";
import { Book } from "app/lib/books";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  combo: Combo;
};

export default function ComboDetail({ combo }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    { url: combo.image, title: combo.name, isComboImage: true },
    ...combo.books.map((book) => ({
      url: book.cover_image,
      title: book.title,
      isComboImage: false,
    })),
  ];

  const router = useRouter();
  const handleBookClick = (book: Book) => {
    router.push(`/books/${book.slug}`);
  };

  const totalOriginalPrice = combo.books.reduce(
    (sum, book) => sum + parseFloat(book.price),
    0
  );
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(combo.price));

  const savingsAmount = totalOriginalPrice - Number(combo.price);
  const savingsPercentage = (savingsAmount / totalOriginalPrice) * 100;

  // Get unique authors from all books
  const allAuthors = combo.books.flatMap((book) => book.authors || []);
  console.log(combo.books);
  const uniqueAuthors = [
    ...new Map(allAuthors.map((author) => [author.id, author])).values(),
  ];

  // Get unique categories from all books
  const allCategories = combo.books.flatMap((book) => book.categories || []);
  const uniqueCategories = [
    ...new Map(
      allCategories.map((category) => [category.id, category])
    ).values(),
  ];

  // Calculate average rating across all books
  const ratings = combo.books
    .map((book) => Number(book.star_rating) || 0)
    .filter((rating) => rating > 0);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
  const totalRatings = (combo.books as Book[]).reduce(
    (sum, book) => sum + (book.star_rating || 0),
    0
  );

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

  return (
    <div className="max-w-7xl mx-auto p-4 rounded-lg shadow-md bg-gray-100">
      {/* Combo Header */}
      <div className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span>Combo: {combo.name}</span>
        <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
          -{savingsPercentage.toFixed(0)}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Image Carousel */}
        <div className="col-span-1 relative">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              width={800}
              height={800}
              src={carouselImages[currentImageIndex]?.url || "/placeholder.png"}
              alt={carouselImages[currentImageIndex]?.title || combo.name}
              className="w-full h-full object-cover"
            />

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
                    currentImageIndex === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                ></button>
              ))}
            </div>
          </div>

          <div className="flex mt-2 gap-2 overflow-x-auto">
            {/* Combo image thumbnail */}
            <button
              className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                currentImageIndex === 0 ? "border-blue-500" : "border-gray-200"
              }`}
              onClick={() => setCurrentImageIndex(0)}
            >
              <Image
                width={64}
                height={64}
                src={combo.image || "/placeholder.png"}
                alt={combo.name}
                className="w-full h-full object-cover"
              />
            </button>

            {/* Book thumbnails */}
            {combo.books.slice(0, 4).map((book, index) => (
              <button
                key={book.id}
                className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                  currentImageIndex === index + 1
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <Image
                  src={book.cover_image || "/placeholder.png"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  width={64}
                  height={96}
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Middle Column - Main Info */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex flex-col h-full">
            {/* Basic Details */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-bold text-gray-800">
                  {combo.name}
                </h1>
                <span className="text-sm text-gray-500">
                  ({combo.books.length} sách)
                </span>
              </div>

              <div className="flex items-center mt-2">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="ml-2 text-sm text-gray-600">
                  ({totalRatings} đánh giá)
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-600">
                  Đã bán: {combo.sold || 0}
                </span>
              </div>

              {/* Authors and Categories */}
              <div className="mt-3">
                <div className="flex flex-wrap items-center text-sm">
                  <span className="text-gray-600 mr-1">Tác giả:</span>
                  {uniqueAuthors.slice(0, 3).map((author, index) => (
                    <span key={author.id}>
                      <span
                        className="text-blue-600 hover:underline cursor-pointer pl-1"
                        onClick={() => {
                          router.push(`/authors/${author.slug}`);
                        }}
                      >
                        {author.name}
                      </span>
                      {index < Math.min(uniqueAuthors.length, 3) - 1 && ", "}
                    </span>
                  ))}
                  {uniqueAuthors.length > 3 && (
                    <span className="text-gray-600">...</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center text-sm mt-1">
                  <span className="text-gray-600 mr-1">Danh mục:</span>
                  {uniqueCategories.slice(0, 3).map((category, index) => (
                    <span key={category.id}>
                      <span
                        className="text-blue-600 hover:underline cursor-pointer pl-1"
                        onClick={() => {
                          router.push(`/search?category=${category.slug}`);
                        }}
                      >
                        {category.name}
                      </span>
                      {index < Math.min(uniqueCategories.length, 3) - 1 && ", "}
                    </span>
                  ))}
                  {uniqueCategories.length > 3 && (
                    <span className="text-gray-600">...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-red-600">
                  {formattedPrice}
                </span>
                <span className="ml-2 text-lg line-through text-gray-500"></span>
                <span className="ml-2 text-red-600 text-sm">
                  Tiết kiệm: {savingsAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                {combo.stock > 0 ? (
                  <span className="text-green-600">
                    Còn hàng ({combo.stock})
                  </span>
                ) : (
                  <span className="text-red-600">Hết hàng</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Mô tả:</h3>
              <p className="text-gray-600 text-sm">
                {combo.description || "Không có mô tả."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Book List Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Sách trong combo
        </h2>
        <div className="space-y-4">
          {combo.books.map((book) => (
            <div
              key={book.id}
              className="border rounded-lg p-4 cursor-pointer flex items-start gap-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              onClick={() => handleBookClick(book)}
            >
              <div className="w-16 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={book.cover_image || "/placeholder.png"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  width={64}
                  height={96}
                  sizes="64px"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{book.title}</h3>

                <div className="mt-1 flex items-center">
                  <div className="flex">
                    {renderStars(book.star_rating || 0)}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    ({Number(book.star_rating)?.toFixed(1) || 0} đánh giá)
                  </span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-xs text-gray-500">
                    Đã bán: {book.sold || 0}
                  </span>
                </div>

                {book.authors && book.authors.length > 0 && (
                  <div className="text-xs text-gray-600 mt-1">
                    <span>Tác giả: </span>
                    {book.authors.map((author, index) => (
                      <span key={author.id}>
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {author.name}
                        </span>
                        {index < book.authors.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2 flex items-baseline">
                  <span className="text-red-600 font-medium">
                    {Number(book.final_price).toLocaleString("vi-VN")}₫
                  </span>
                  {Number(book.final_price) !== Number(book.price) && (
                    <span className="ml-2 text-xs line-through text-gray-500">
                      {Number(book.price).toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

