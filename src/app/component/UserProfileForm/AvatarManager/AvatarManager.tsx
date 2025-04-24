"use client";

import { useUploadAvatar } from "hooks/useUploadAvatar";
import Image from "next/image";
import { useState } from "react";
import { FiCamera, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

type AvatarManagerProps = {
    avatar: string | null;
    onAvatarChange?: (file: File) => void;
};

export const AvatarManager = ({ avatar, onAvatarChange }: AvatarManagerProps) => {
    const defaultAvatar =
        avatar ??
        "https://res.cloudinary.com/dswj1rtvu/image/upload/v1745051027/BookStore/Authors/istockphoto-1451587807-612x612_f8h3fr.jpg";

    const [previewUrl, setPreviewUrl] = useState<string>(defaultAvatar);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { mutate: uploadAvatar, isPending } = useUploadAvatar();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 2MB.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file hình ảnh.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
            setSelectedFile(file);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast.warning("Vui lòng chọn ảnh trước khi tải lên.");
            return;
        }

        uploadAvatar(selectedFile, {
            onSuccess: (res) => {
                if (res?.data?.avatar) {
                    setPreviewUrl(res.data.avatar);
                    toast.success("Cập nhật ảnh đại diện thành công!");
                }

                if (onAvatarChange) {
                    onAvatarChange(selectedFile);
                }

                setSelectedFile(null);
            },
            onError: () => {
                toast.error("Tải ảnh thất bại. Vui lòng thử lại.");
            },
        });
    };

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200">
                    <Image
                        src={previewUrl}
                        alt="Avatar"
                        width={160}
                        height={160}
                        className="rounded-full object-cover"
                    />
                </div>

                <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors"
                >
                    <FiCamera size={20} />
                </label>

                <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <h2 className="text-xl font-semibold">{/* Tên người dùng */}</h2>
            <p className="text-gray-600 text-sm">{/* Email người dùng */}</p>

            <div className="mt-4">
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isPending}
                    className="text-sm flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded transition-colors cursor-pointer disabled:opacity-60"
                >
                    <FiUpload size={16} />
                    {isPending ? "Đang tải lên..." : "Thay đổi ảnh đại diện"}
                </button>
            </div>
        </div>
    );
};
