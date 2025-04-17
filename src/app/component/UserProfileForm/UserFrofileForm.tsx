import React, { useState } from "react";
import { FiMail, FiPhone, FiUser, FiMapPin, FiCalendar } from "react-icons/fi";
import { useUpdateUserProfile } from "hooks/useUpdateProfile";

export interface User {
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  birth_day: string;
}

interface UserProfileFormProps {
  initialData?: User;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  initialData = {
    email: "",
    full_name: "",
    phone_number: "",
    address: "",
    birth_day: "",
  },
}) => {
  const [formData, setFormData] = useState<User>(initialData);
  const updateUser = useUpdateUserProfile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser.mutate(formData);
  };

  return (
    <div className="max-w-md p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-8">
        Chỉnh Sửa Thông Tin Cá Nhân
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Họ và tên */}
        <div className="mb-6">
          <label className="block text-left text-gray-700 mb-2">
            Họ và tên
          </label>
          <div className="bg-gray-100 rounded-lg flex items-center">
            <FiUser className="text-gray-500 mx-3" />
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="bg-transparent w-full py-3 px-4 text-left outline-none"
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
        </div>

        {/* Số điện thoại */}
        <div className="mb-6">
          <label className="block text-left text-gray-700 mb-2">
            Số điện thoại
          </label>
          <div className="bg-gray-100 rounded-lg flex items-center">
            <FiPhone className="text-gray-500 mx-3" />
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="bg-transparent w-full py-3 px-4 text-left outline-none"
              placeholder="Nhập số điện thoại của bạn"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-left text-gray-700 mb-2">Email</label>
          <div className="bg-gray-100 rounded-lg flex items-center">
            <FiMail className="text-gray-500 mx-3" />
            <input
              type="email"
              name="email"
              readOnly
              value={formData.email}
              className="bg-transparent w-full py-3 px-4 text-left outline-none text-gray-400 cursor-not-allowed"
              placeholder="Email của bạn"
            />
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="mb-6">
          <label className="block text-left text-gray-700 mb-2">Địa chỉ</label>
          <div className="bg-gray-100 rounded-lg flex items-center">
            <FiMapPin className="text-gray-500 mx-3" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="bg-transparent w-full py-3 px-4 text-left outline-none"
              placeholder="Nhập địa chỉ của bạn"
            />
          </div>
        </div>

        {/* Ngày sinh */}
        <div className="mb-6">
          <label className="block text-left text-gray-700 mb-2">
            Ngày sinh
          </label>
          <div className="bg-gray-100 rounded-lg flex items-center">
            <FiCalendar className="text-gray-500 mx-3" />
            <input
              type="date"
              name="birth_day"
              value={formData.birth_day}
              onChange={handleChange}
              className="bg-transparent w-full py-3 px-4 text-left outline-none"
            />
          </div>
        </div>

        {/* Nút submit */}
        <button
          type="submit"
          disabled={updateUser.isPending}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg mt-6 transition duration-200 disabled:opacity-50"
        >
          {updateUser.isPending ? "Đang cập nhật..." : "Cập Nhật Thông Tin"}
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
