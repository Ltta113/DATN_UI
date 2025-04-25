import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
    src?: string;
    alt?: string;
    size?: number;
}

export const UserAvatar = ({
    src,
    alt = "Người dùng",
    size = 60
}: UserAvatarProps) => {
    if (src) {
        return (
            <Image
                src={src}
                width={size}
                height={size}
                alt={alt}
                className="rounded-full object-cover object-center scale-110"
            />
        );
    }

    return (
        <div
            className={`w-[${size}px] h-[${size}px] rounded-full bg-gray-200 flex items-center justify-center`}
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
        </div>
    );
};