"use client";

import React, { JSX, useEffect, useState } from "react";
import {
  FiMail,
  FiPhone,
  FiUser,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import { useUpdateUserProfile } from "hooks/useUpdateProfile";
import { useAuth } from "app/context/AuthContext";
import { locations } from "util/VietNam";
import { toast } from "react-toastify";
import { AvatarManager } from "./AvatarManager/AvatarManager";

export interface User {
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  birth_day: string;
  province: string;
  district: string;
  ward: string;
  avatar: string | null;
}

const UserProfileForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<User>(user as User);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const updateUser = useUpdateUserProfile();

  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  useEffect(() => {
    const selectedProvince = locations.provinces.find(
      (p) => p.name === formData.province
    );
    if (selectedProvince) {
      setDistricts(selectedProvince.districts.map((d) => d.name));
    } else {
      setDistricts([]);
    }
    setWards([]);
  }, [formData.province]);

  useEffect(() => {
    const selectedProvince = locations.provinces.find(
      (p) => p.name === formData.province
    );
    const selectedDistrict = selectedProvince?.districts.find(
      (d) => d.name === formData.district
    );
    if (selectedDistrict) {
      setWards(selectedDistrict.wards.map((w) => w.name));
    } else {
      setWards([]);
    }
  }, [formData.district, formData.province]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submissionData = new FormData();

      Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key as keyof User] as string);
      });

      if (avatarFile) {
        submissionData.append('avatar', avatarFile);
      }

      console.log(
        "Submitting data: ",
        Object.fromEntries(submissionData.entries())
      )

      const userData = Object.fromEntries(submissionData.entries()) as unknown as User;
      await updateUser.mutateAsync(userData);
      toast.success("Cập nhật thông tin thành công!");
    } catch {
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  const renderInput = (
    label: string,
    name: keyof User,
    icon: JSX.Element,
    type: string = "text",
    readOnly: boolean = false
  ) => (
    <div className="mb-6">
      <label htmlFor={name} className="block text-left text-gray-700 mb-2">
        {label}
      </label>
      <div className="bg-gray-100 rounded-lg flex items-center">
        <span className="text-gray-500 mx-3">{icon}</span>
        <input
          type={type}
          name={name}
          value={formData[name] ?? ""}
          onChange={handleChange}
          readOnly={readOnly}
          className={`bg-transparent w-full py-3 px-4 text-left outline-none ${readOnly ? "text-gray-400 cursor-not-allowed" : ""
            }`}
          placeholder={`Nhập ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
      <div className="md:w-1/3 bg-white shadow-md rounded-lg p-6">
        <AvatarManager
          avatar={formData.avatar}
          onAvatarChange={handleAvatarChange}
        />

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-4">Thông tin cơ bản</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderInput("Họ và tên", "full_name", <FiUser />)}
            {renderInput("Email", "email", <FiMail />, "email", true)}
            {renderInput("Số điện thoại", "phone_number", <FiPhone />, "tel")}
            {renderInput("Ngày sinh", "birth_day", <FiCalendar />, "date")}
          </form>
        </div>
      </div>

      <div className="md:w-2/3 bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Thông Tin Địa Chỉ</h1>

        <form onSubmit={handleSubmit}>
          {renderInput("Địa chỉ", "address", <FiMapPin />)}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-6">
              <label htmlFor="province" className="block text-left text-gray-700 mb-2">
                Tỉnh / Thành phố
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="bg-gray-100 w-full py-3 px-4 rounded-lg outline-none cursor-pointer"
              >
                <option value="">-- Chọn tỉnh/thành phố --</option>
                {locations.provinces.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="district" className="block text-left text-gray-700 mb-2">
                Quận / Huyện
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="bg-gray-100 w-full py-3 px-4 rounded-lg outline-none cursor-pointer"
                disabled={!formData.province}
              >
                <option value="">-- Chọn quận/huyện --</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="ward" className="block text-left text-gray-700 mb-2">
                Phường / Xã
              </label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className="bg-gray-100 w-full py-3 px-4 rounded-lg outline-none cursor-pointer"
                disabled={!formData.district}
              >
                <option value="">-- Chọn phường/xã --</option>
                {wards.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={updateUser.isPending}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg mt-6 transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            {updateUser.isPending ? "Đang cập nhật..." : "Cập Nhật Thông Tin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
