import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: string;
}

export const StarRating = ({
    rating,
    maxRating = 5,
    size = "text-base"
}: StarRatingProps) => {
    return (
        <div className="flex">
            {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1;

                if (rating >= starValue) {
                    return <FaStar key={index} className={`text-amber-400 ${size}`} />;
                } else if (rating >= starValue - 0.5) {
                    return <FaStarHalfAlt key={index} className={`text-amber-400 ${size}`} />;
                } else {
                    return <FaRegStar key={index} className={`text-gray-300 ${size}`} />;
                }
            })}
        </div>
    );
};
