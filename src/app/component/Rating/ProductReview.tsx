'use client';

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { RatingSummaryCard } from './RatingSummaryCard';
import { ViewAllHeader } from './ViewAllHeader';
import { ReviewCard } from './ReviewCard';
import { Review } from 'app/lib/books';
import { useAuth } from 'app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCreateReview } from 'hooks/useReview';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateReview } from 'hooks/useUpdateReview';

type ReviewData = {
    reviews: Review[];
    reviewableType: 'book' | 'author' | 'order';
    reviewableId: number;
    slug?: string;
    start_rating: number;
    dataReview?: Review;
};

const ProductReview = ({ reviews, reviewableType, reviewableId, slug, start_rating, dataReview }: ReviewData) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'reviews' | 'add-review'>('reviews');
    const [rating, setRating] = useState(dataReview ? dataReview.rating : 0);
    const [hoveredRating, setHoveredRating] = useState(dataReview ? dataReview.rating : 0);
    const [content, setContent] = useState(dataReview ? dataReview.content : '');
    const [reviewsData, setReviewsData] = useState<Review[]>(reviews);

    const { user } = useAuth();
    const createReviewMutation = useCreateReview();
    const updateReviewMutation = useUpdateReview();

    const queryClient = useQueryClient();

    const handleViewAllClick = () => {
        console.log("Xem tất cả đánh giá");
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!dataReview) {
            createReviewMutation.mutate(
                {
                    reviewable_type: reviewableType,
                    reviewable_id: reviewableId,
                    content: content ?? '',
                    rating,
                },
                {
                    onSuccess: (res) => {
                        const newReview = {
                            ...res.data,
                            user: {
                                full_name: user?.full_name,
                                avatar: user?.avatar,
                            },
                        };

                        setReviewsData([newReview, ...reviewsData]);
                        setRating(0);
                        setContent('');
                        setActiveTab('reviews');
                        if (reviewableType === 'book' && slug) {
                            queryClient.invalidateQueries({ queryKey: ["book", slug] });
                        }
                        toast.success('Gửi đánh giá thành công');

                    },
                    onError: (error: any) => {
                        toast.error(error?.response?.data?.message ?? 'Gửi đánh giá thất bại');
                    },
                }
            );
        } else {
            updateReviewMutation.mutate(
                {
                    id: dataReview?.id ?? 0,
                    reviewable_type: reviewableType,
                    reviewable_id: reviewableId,
                    content: content ?? '',
                    rating,
                },
                {
                    onSuccess: (res) => {
                        const updatedReview = {
                            ...res.data,
                            user: {
                                full_name: user?.full_name,
                                avatar: user?.avatar,
                            },
                        };

                        setReviewsData((prevReviews) =>
                            prevReviews.map((review) =>
                                review.id === updatedReview.id ? updatedReview : review
                            )
                        );
                        setRating(0);
                        setContent('');
                        setActiveTab('reviews');
                        if (reviewableType === 'book' && slug) {
                            queryClient.invalidateQueries({ queryKey: ["book", slug] });
                        }
                        toast.success('Cập nhật đánh giá thành công');
                    },
                    onError: (error: any) => {
                        toast.error(error?.response?.data?.message ?? 'Cập nhật đánh giá thất bại');
                    },
                }
            );
        }
    };

    return (
        <div>
            <div className="flex border-b border-gray-300 mb-6">
                <button
                    className={`mr-6 py-2 px-1 font-medium text-lg cursor-pointer relative ${activeTab === 'reviews'
                        ? 'text-orange-500 border-b-2 border-orange-500'
                        : 'text-gray-600 hover:text-orange-500'
                        }`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Đánh giá <span className="text-orange-500">({reviewsData.length})</span>
                </button>
                <button
                    className={`py-2 px-1 font-medium text-lg relative cursor-pointer ${activeTab === 'add-review'
                        ? 'text-orange-500 border-b-2 border-orange-500'
                        : 'text-gray-600 hover:text-orange-500'
                        }`}
                    onClick={() => setActiveTab('add-review')}
                >
                    Viết đánh giá
                </button>
            </div>

            {activeTab === 'reviews' && reviewsData.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <RatingSummaryCard
                            title="Đánh giá xếp hạng có 5 sao từ người dùng"
                        />
                        <RatingSummaryCard
                            title="Điểm đánh giá từ người dùng"
                            rating={parseFloat((Number(start_rating) || 0).toFixed(1))}
                            count={reviewsData.length}
                        />
                    </div>

                    <ViewAllHeader
                        title="Tất cả đánh giá"
                        onAction={handleViewAllClick}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reviewsData.map(review => (
                            <ReviewCard
                                key={review.id}
                                isMy={(user?.id === review.user.id)}
                                username={review.user.full_name}
                                avatarSrc={review.user.avatar}
                                rating={review.rating}
                                date={review.created_at}
                                content={review.content}
                                onEdit={() => {
                                    setActiveTab('add-review');
                                    setRating(review.rating);
                                    setHoveredRating(review.rating);
                                    setContent(review.content ?? '');
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'reviews' && reviewsData.length === 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Chưa có đánh giá nào</h2>
                    <p className="text-gray-600">Hãy là người đầu tiên viết đánh giá cho sản phẩm này!</p>
                    <button
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md cursor-pointer"
                        onClick={() => setActiveTab('add-review')}
                    >
                        Viết đánh giá
                    </button>
                </div>
            )}

            {activeTab === 'add-review' && !user && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Đăng nhập để viết đánh giá</h2>
                    <p className="text-gray-600">Bạn cần đăng nhập để viết đánh giá cho sản phẩm này.</p>
                    <button
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md cursor-pointer"
                        onClick={() => router.push('/login')}
                    >
                        Đăng nhập
                    </button>
                </div>
            )}

            {activeTab === 'add-review' && user && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Viết đánh giá của bạn</h2>
                    <form onSubmit={handleSubmitReview}>
                        {/* Star rating input */}
                        <div className="mb-6">
                            <label htmlFor="star" className="block text-gray-700 mb-2">
                                Xếp hạng của bạn
                            </label>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`cursor-pointer text-2xl ${star <= (hoveredRating ?? rating) ? 'text-amber-400' : 'text-gray-300'
                                            } mr-1`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Content input */}
                        <div className="mb-6">
                            <label htmlFor="review-content" className="block text-gray-700 mb-2">
                                Nội dung đánh giá
                            </label>
                            <textarea
                                id="review-content"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[150px]"
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này"
                                value={content ?? ''}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 mr-4 py-2 px-6 rounded-md"
                                onClick={() => setActiveTab('reviews')}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white py-2 px-6 rounded-md"
                                disabled={createReviewMutation.isPending}
                            >
                                {createReviewMutation.isPending ? 'Đang gửi...' : (reviewsData ? 'Sửa đánh giá của bạn' : 'Gửi đánh giá')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
};

export default ProductReview;
