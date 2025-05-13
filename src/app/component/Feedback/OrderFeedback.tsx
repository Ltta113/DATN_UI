'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Order } from 'app/context/OrderContent';
import { useCreateFeedback } from 'hooks/useCreateFeedback';
import { useUpdateFeedback } from 'hooks/useUpdateFeedback';
import { FaImage, FaStar } from 'react-icons/fa';

interface OrderFeedbackProps {
    order: Omit<Order, 'user_id' | 'total_amount'>,
    feedbackInit?: Feedback
}

export interface Feedback {
    id: number;
    order_id: number;
    rating: number;
    feedback: string;
    images: {
        url: string;
        public_id: string;
    }[];
}

const OrderFeedback = ({ order, feedbackInit }: OrderFeedbackProps) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [deleteImages, setDeleteImages] = useState<string[]>([]);
    const [rating, setRating] = useState(feedbackInit?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState(feedbackInit?.rating || 0);
    const [feedback, setFeedback] = useState(feedbackInit?.feedback || '');
    const [errors, setErrors] = useState<{ rating?: string; feedback?: string }>({});

    const { mutate: createFeedback, isPending: isCreating } = useCreateFeedback();
    const { mutate: updateFeedback, isPending: isUpdating } = useUpdateFeedback();
    const isPending = isCreating || isUpdating;

    const queryClient = useQueryClient();

    useEffect(() => {
        if (feedbackInit?.images?.length) {
            setPreviewUrls(feedbackInit.images.map(image => image.url));
        }
    }, [feedbackInit]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedImages([...selectedImages, ...files]);

            const urls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls([...previewUrls, ...urls]);
        }
    };

    const validateForm = () => {
        const newErrors: { rating?: string; feedback?: string } = {};

        if (!rating) {
            newErrors.rating = 'Vui lòng chọn số sao đánh giá';
        }

        if (!feedback.trim()) {
            newErrors.feedback = 'Vui lòng nhập phản hồi của bạn';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('order_id', order.id.toString());
        formData.append('rating', rating.toString());
        formData.append('feedback', feedback);
        selectedImages.forEach(image => {
            formData.append('images[]', image);
            console.log(image);
        });

        if (!feedbackInit) {
            createFeedback(formData, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["order", order.id] });
                    toast.success('Phản hồi đã được gửi thành công');
                },
                onError: (error: any) => {
                    toast.error(error.response.data.message);
                }
            });
        } else {
            formData.append('delete_images', deleteImages.join(','));
            formData.append('_method', 'PUT');
            updateFeedback({ formData, id: feedbackInit.id.toString() }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["order", order.id] });
                    toast.success('Phản hồi đã được cập nhật thành công');
                }
            });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                {feedbackInit ? 'Cập nhật đánh giá' : 'Đánh giá đơn hàng'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Stars */}
                <div>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`cursor-pointer text-2xl ${star <= (hoveredRating ?? rating)
                                    ? "text-amber-400"
                                    : "text-gray-300"
                                    } mr-1`}
                                onClick={() => {
                                    setRating(star);
                                    setHoveredRating(star);
                                    setErrors(prev => ({ ...prev, rating: undefined }));
                                }}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(rating)}
                            />
                        ))}
                    </div>
                    {errors.rating && (
                        <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                    )}
                </div>

                {/* Feedback Text */}
                <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                        Phản hồi của bạn
                    </label>
                    <textarea
                        id="feedback"
                        rows={4}
                        value={feedback}
                        onChange={(e) => {
                            setFeedback(e.target.value);
                            setErrors(prev => ({ ...prev, feedback: undefined }));
                        }}
                        placeholder="Nhập phản hồi của bạn"
                        className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-indigo-500 
                            border-1 ${errors.feedback ? 'border-red-500' : 'border-gray-300'
                            }
                            focus:border-indigo-500 sm:text-sm `}
                    />
                    {errors.feedback && (
                        <p className="mt-1 text-sm text-red-600">{errors.feedback}</p>
                    )}
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                        Hình ảnh (tùy chọn)
                    </label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                            <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="images"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Tải ảnh lên</span>
                                    <input
                                        id="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />
                                </label>
                                <p className="pl-1">hoặc kéo thả vào đây</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 2MB</p>
                        </div>
                    </div>
                </div>

                {/* Image Previews */}
                {previewUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="h-48 w-48 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedImages(prev => prev.filter((_, i) => i !== index));
                                        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                                        if (feedbackInit?.images) {
                                            for (let i = 0; i < feedbackInit?.images?.length; i++) {
                                                if (feedbackInit?.images[i].url === url) {
                                                    setDeleteImages(prev => [...prev, feedbackInit?.images[i].public_id]);
                                                }
                                            }
                                        }
                                    }}
                                    className="absolute cursor-pointer top-0 right-0 bg-red-500 text-white rounded-full px-2"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isPending ? 'Đang xử lý...' : feedbackInit ? 'Cập nhật' : 'Gửi phản hồi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrderFeedback;