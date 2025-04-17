"use client";

import UserProfileForm from "app/component/UserProfileForm/UserFrofileForm";
import UserProfileAvatar from "app/component/UserProfileForm/UserProfilePicture";
import { useAuth } from "app/context/AuthContext";
import { useState } from "react";
import { toast } from "react-hot-toast"; // Giả sử bạn đang sử dụng react-hot-toast

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Gọi API để cập nhật thông tin
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // if (!response.ok) throw new Error('Lỗi cập nhật thông tin');

      // Giả lập delay API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Cập nhật thông tin thành công!");
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <UserProfileForm
        initialData={user ?? undefined}
        onSubmit={handleSubmit}
      />
      <UserProfileAvatar
        imageUrl="/path-to-your-image.jpg"
        userName={user?.full_name ?? ""}
      />
    </div>
  );
}
