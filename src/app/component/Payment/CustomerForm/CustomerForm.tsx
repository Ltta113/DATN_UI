"use client";

import { useAuth } from "app/context/AuthContext";
import { OrderErrors } from "hooks/useCreateOrder";
import React, { useEffect, useState } from "react";
import { locations } from "util/VietNam";

export type CustomerInfo = {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  notes: string;
  province?: string;
  district?: string;
  ward?: string;
};

const CustomerInfoForm = ({
  customerInfo,
  setCustomerInfo,
  errors,
}: {
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  errors?: OrderErrors;
}) => {
  const { user } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setCustomerInfo((prev: CustomerInfo) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        province: user.province || "",
        district: user.district || "",
        ward: user.ward || "",
      }));
    }
  }, [setCustomerInfo, user]);

  const renderError = (fieldErrors?: string[]) => {
    if (!fieldErrors || fieldErrors.length === 0) return null;
    return <div className="text-red-500 text-sm mt-1">{fieldErrors[0]}</div>;
  };

  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  useEffect(() => {
    setProvinces(locations.provinces.map((province) => province.name));
  }, []);

  useEffect(() => {
    if (customerInfo.province) {
      const selectedProvince = locations.provinces.find(
        (province) => province.name === customerInfo.province
      );
      if (selectedProvince) {
        setDistricts(selectedProvince.districts.map((district) => district.name));
      }
    }
  }, [customerInfo.province]);

  useEffect(() => {
    if (customerInfo.district) {
      const selectedProvince = locations.provinces.find(
        (province) => province.name === customerInfo.province
      );
      if (selectedProvince) {
        const selectedDistrict = selectedProvince.districts.find(
          (district) => district.name === customerInfo.district
        );
        if (selectedDistrict) {
          setWards(selectedDistrict.wards.map((ward) => ward.name));
        }
      }
    }
  }, [customerInfo.district, customerInfo.province]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceName = e.target.value;
    const province = locations.provinces.find(p => p.name === provinceName);
    if (province) {
      setCustomerInfo((prev) => ({
        ...prev,
        province: provinceName,
      }));
      setDistricts(province.districts.map(district => district.name));
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    const district = districts.find(d => d === districtName);
    if (district) {
      setCustomerInfo((prev) => ({
        ...prev,
        district: districtName,
      }));
      const selectedProvince = locations.provinces.find(p => p.name === customerInfo.province);
      if (selectedProvince) {
        const selectedDistrict = selectedProvince.districts.find(d => d.name === districtName);
        if (selectedDistrict) {
          setWards(selectedDistrict.wards.map(ward => ward.name));
        }
      }
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardName = e.target.value;
    setCustomerInfo((prev) => ({
      ...prev,
      ward: wardName,
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={customerInfo.full_name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors?.errors?.name ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          required
        />
        {renderError(errors?.errors?.name)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors?.errors?.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            required
          />
          {renderError(errors?.errors?.email)}
        </div>
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={customerInfo.phone_number}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors?.errors?.phone ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            required
          />
          {renderError(errors?.errors?.phone)}
        </div>
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Địa chỉ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={customerInfo.address}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors?.errors?.address ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          required
        />
        {renderError(errors?.errors?.address)}
      </div>

      <div>
        <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
          Tỉnh/Thành phố <span className="text-red-500">*</span>
        </label>
        <select
          id="province"
          name="province"
          value={customerInfo.province}
          onChange={handleProvinceChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
          Quận/Huyện <span className="text-red-500">*</span>
        </label>
        <select
          id="district"
          name="district"
          value={customerInfo.district}
          onChange={handleDistrictChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
          Phường/Xã <span className="text-red-500">*</span>
        </label>
        <select
          id="ward"
          name="ward"
          value={customerInfo.ward}
          onChange={handleWardChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          {wards.map((ward) => (
            <option key={ward} value={ward}>
              {ward}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ghi chú
        </label>
        <textarea
          id="notes"
          name="notes"
          value={customerInfo.notes}
          onChange={handleInputChange}
          rows={3}
          className={`w-full px-3 py-2 border ${errors?.errors?.note ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
          placeholder="Thông tin bổ sung về đơn hàng..."
        ></textarea>
        {renderError(errors?.errors?.note)}
      </div>
    </div>
  );
};

export default CustomerInfoForm;
