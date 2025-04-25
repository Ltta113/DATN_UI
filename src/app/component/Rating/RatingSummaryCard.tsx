import React from 'react';
import { StarRating } from './StarRating';

interface RatingSummaryCardProps {
    title: string;
    rating?: number;
    count?: number;
}

export const RatingSummaryCard = ({
    title,
    rating,
    count
}: RatingSummaryCardProps) => {
    return (
        <div className="border rounded-lg p-6 flex items-center justify-between">
            {rating && <div className="text-xl font-bold">{rating}</div>}
            <div>
                <p className="text-gray-600">{title}</p>
                {count && <p className="text-sm text-gray-500">({count} đánh giá)</p>}
            </div>
            <StarRating rating={rating ?? 5} size="text-2xl" />
        </div>
    );
};