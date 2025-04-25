import React from 'react';
import { StarRating } from './StarRating';
import { UserAvatar } from './UserAvatar';

interface ReviewCardProps {
    isMy?: boolean;
    username: string;
    avatarSrc?: string;
    rating: number;
    date: string;
    content: string | null;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const ReviewCard = ({
    isMy = false,
    username,
    avatarSrc,
    rating,
    date,
    content,
    onEdit,
    onDelete,
}: ReviewCardProps) => {
    const formattedDateTime = new Date(date).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="border rounded-lg p-6 relative">
            <div className="flex items-center mb-4">
                <div className="mr-4">
                    <UserAvatar src={avatarSrc} alt={username} />
                </div>
                <div>
                    <p className="font-bold">{username}</p>
                    <StarRating rating={rating} />
                    <p className="text-gray-500 text-sm">{formattedDateTime}</p>
                </div>
            </div>

            <p className="mb-4">{content}</p>

            {isMy && (
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={onEdit}
                        className="text-sm cursor-pointer border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded px-3 py-1 transition-colors"
                    >
                        Sửa
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-sm cursor-pointer border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded px-3 py-1 transition-colors"
                    >
                        Xoá
                    </button>
                </div>
            )}

        </div>
    );
};
