"use client";

import React from "react";
import Image from "next/image";
// import { FiEdit } from "react-icons/fi";

interface UserProfileAvatarProps {
  imageUrl: string;
  userName: string;
//   onEditAvatar?: () => void;
}

const UserProfileAvatar: React.FC<UserProfileAvatarProps> = ({
  imageUrl,
  userName,
//   onEditAvatar,
}) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8 bg-white shadow-md rounded-lg p-4">
      <div className="relative">
        <div className="w-40 h-40 rounded-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${userName}'s profile picture`}
            width={160}
            height={160}
            className="object-cover w-full h-full"
          />
        </div>

        {/* {onEditAvatar && (
          <button
            onClick={onEditAvatar}
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md"
            aria-label="Edit profile picture"
          >
            <FiEdit className="text-gray-600" size={20} />
          </button>
        )} */}
      </div>

      <h2 className="mt-4 text-2xl font-medium text-center">{userName}</h2>
    </div>
  );
};

export default UserProfileAvatar;
