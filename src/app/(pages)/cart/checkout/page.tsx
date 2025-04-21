"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';
import { BiCheck, BiHomeAlt, BiArrowBack } from 'react-icons/bi';
import { FaRegCreditCard, FaCcVisa, FaCcMastercard, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from 'app/context/AuthContext';

interface OrderItem {
    id: number;
    book_id: number;
    quantity: number;
    price: number;
    book: {
        id: number;
        title: string;
        authors: { name: string }[];
        cover_image: string;
    };
}

interface OrderData {
    id: number;
    code: string;
    total: number;
    status: string;
    created_at: string;
    order_items: OrderItem[];
}

interface CustomerInfo {
    full_name: string;
    phone_number: string;
    address: string;
    notes: string;
    email: string;
}

export default function OrderConfirmationPage() {
    const router = useRouter();

    const { user } = useAuth();

    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
    const [isProcessing, setIsProcessing] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        address: user?.address || '',
        notes: ''
    });

    useEffect(() => {
        const loadData = () => {
            setIsLoading(true);

            const fakeOrderData: OrderData = {
                id: 12345,
                code: 'ORD-12345',
                total: 453000,
                status: 'pending',
                created_at: new Date().toISOString(),
                order_items: [
                    {
                        id: 1,
                        book_id: 101,
                        quantity: 2,
                        price: 85000,
                        book: {
                            id: 101,
                            title: "Đắc Nhân Tâm",
                            authors: [{ name: "Dale Carnegie" }],
                            cover_image: "/api/placeholder/120/160",
                        }
                    },
                    {
                        id: 2,
                        book_id: 102,
                        quantity: 1,
                        price: 120000,
                        book: {
                            id: 102,
                            title: "Nghĩ Giàu Làm Giàu",
                            authors: [{ name: "Napoleon Hill" }],
                            cover_image: "/api/placeholder/120/160",
                        }
                    },
                    {
                        id: 3,
                        book_id: 103,
                        quantity: 2,
                        price: 78000,
                        book: {
                            id: 103,
                            title: "Đời Ngắn Đừng Ngủ Dài",
                            authors: [{ name: "Robin Sharma" }],
                            cover_image: "/api/placeholder/120/160",
                        }
                    }
                ]
            };

            setOrderData(fakeOrderData);
            setIsLoading(false);

        };

        loadData();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaymentMethodChange = (method: 'cod' | 'card') => {
        setPaymentMethod(method);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const requiredFields: (keyof CustomerInfo)[] = ['full_name', 'email', 'phone_number', 'address'];
        const missingFields = requiredFields.filter(field => !customerInfo[field]);

        if (missingFields.length > 0) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
            toast.error('Email không hợp lệ');
            return;
        }

        const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        if (!phoneRegex.test(customerInfo.phone)) {
            toast.error('Số điện thoại không hợp lệ');
            return;
        }

        localStorage.setItem('customerInfo', JSON.stringify(customerInfo));

        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            toast.success('Thanh toán thành công!');
            router.push('/payment-success');
        }, 2000);
    };

    // if (!user) {
    //     router.push('/login');
    //     return null;
    // }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">
                        Đang tải thông tin đơn hàng...
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Xác nhận đơn hàng #{orderData?.code} - Thanh toán</title>
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center mb-6">
                        <a href="/" className="text-gray-600 hover:text-orange-500 flex items-center">
                            <BiHomeAlt className="mr-2" />
                            Trang chủ
                        </a>
                        <span className="mx-2 text-gray-400">/</span>
                        <a href="/cart" className="text-gray-600 hover:text-orange-500">
                            Giỏ hàng
                        </a>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-800 font-medium">Xác nhận đơn hàng</span>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Xác nhận đơn hàng <span className="text-orange-500">#{orderData?.code}</span>
                        </h1>
                        <p className="text-gray-600">
                            Vui lòng kiểm tra thông tin đơn hàng và điền thông tin thanh toán để hoàn tất giao dịch.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Thông tin đơn hàng */}
                        <div className="lg:w-7/12">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <h2 className="font-semibold text-gray-800 flex items-center">
                                        <span className="bg-orange-100 text-orange-600 p-1 rounded-full mr-2">
                                            <BiCheck />
                                        </span>
                                        Chi tiết đơn hàng
                                    </h2>
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                                        <span>Ngày đặt hàng: {orderData && formatDate(orderData.created_at)}</span>
                                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium uppercase">
                                            {orderData?.status === 'pending' ? 'Chờ thanh toán' : orderData?.status}
                                        </span>
                                    </div>

                                    <div className="divide-y divide-gray-200">
                                        {orderData?.order_items.map((item) => (
                                            <div key={item.id} className="py-4 flex">
                                                <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={item.book.cover_image}
                                                        alt={item.book.title}
                                                        width={80}
                                                        height={96}
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="ml-4 flex-1">
                                                    <h3 className="font-medium text-gray-800">{item.book.title}</h3>
                                                    <p className="text-gray-600 text-sm">
                                                        {item.book.authors.map(a => a.name).join(", ")}
                                                    </p>

                                                    <div className="flex justify-between items-end mt-2">
                                                        <div className="text-sm">
                                                            <span className="text-gray-600">Đơn giá: </span>
                                                            <span className="font-medium">{formatPrice(item.price)}</span>
                                                        </div>
                                                        <div className="text-sm">
                                                            <span className="text-gray-600">Số lượng: </span>
                                                            <span className="font-medium">{item.quantity}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-orange-600">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Tạm tính:</span>
                                            <span>{formatPrice(orderData?.total || 0)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Phí vận chuyển:</span>
                                            <span>{formatPrice(0)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                                            <span>Tổng cộng:</span>
                                            <span className="text-orange-600">{formatPrice(orderData?.total || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <a href="/cart" className="text-orange-500 hover:text-orange-600 flex items-center justify-end">
                                    <BiArrowBack className="mr-2" />
                                    Quay lại giỏ hàng
                                </a>
                            </div>
                        </div>

                        {/* Form thanh toán */}
                        <div className="lg:w-5/12">
                            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <h2 className="font-semibold text-gray-800">
                                        Thông tin thanh toán
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                                Họ và tên <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                name="fullName"
                                                value={customerInfo.fullName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={customerInfo.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Số điện thoại <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={customerInfo.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                                Địa chỉ <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={customerInfo.address}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                required
                                            />
                                        </div>

                                        {/* <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id="city"
                                                    name="city"
                                                    value={customerInfo.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                    required
                                                >
                                                    <option value="">Chọn tỉnh/thành</option>
                                                    <option value="HN">Hà Nội</option>
                                                    <option value="HCM">TP. Hồ Chí Minh</option>
                                                    <option value="DN">Đà Nẵng</option>
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
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                    required
                                                >
                                                    <option value="">Chọn quận/huyện</option>
                                                    <option value="Q1">Quận 1</option>
                                                    <option value="Q2">Quận 2</option>
                                                    <option value="Q3">Quận 3</option>
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
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                    required
                                                >
                                                    <option value="">Chọn phường/xã</option>
                                                    <option value="P1">Phường 1</option>
                                                    <option value="P2">Phường 2</option>
                                                    <option value="P3">Phường 3</option>
                                                </select>
                                            </div>
                                        </div> */}

                                        <div>
                                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                                Ghi chú
                                            </label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                value={customerInfo.notes}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                placeholder="Thông tin bổ sung về đơn hàng..."
                                            ></textarea>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <h3 className="text-lg font-medium text-gray-800 mb-3">Phương thức thanh toán</h3>

                                            <div className="space-y-3">
                                                <div
                                                    className={`border ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'} rounded-md p-3 flex items-center cursor-pointer`}
                                                    onClick={() => handlePaymentMethodChange('cod')}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border ${paymentMethod === 'cod' ? 'border-orange-500' : 'border-gray-400'} flex items-center justify-center`}>
                                                        {paymentMethod === 'cod' && (
                                                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <div className="font-medium flex items-center">
                                                            <FaMoneyBillWave className="text-green-600 mr-2" />
                                                            Thanh toán khi nhận hàng (COD)
                                                        </div>
                                                        <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`border ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'} rounded-md p-3 flex items-center cursor-pointer`}
                                                    onClick={() => handlePaymentMethodChange('card')}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border ${paymentMethod === 'card' ? 'border-orange-500' : 'border-gray-400'} flex items-center justify-center`}>
                                                        {paymentMethod === 'card' && (
                                                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <div className="font-medium flex items-center">
                                                            <FaRegCreditCard className="text-blue-600 mr-2" />
                                                            Thanh toán bằng thẻ
                                                        </div>
                                                        <p className="text-sm text-gray-600 flex items-center mt-1">
                                                            <FaCcVisa className="text-blue-700 mr-2" size={24} />
                                                            <FaCcMastercard className="text-red-600" size={24} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {paymentMethod === 'card' && (
                                                <div className="mt-4 space-y-4 p-4 border border-gray-200 rounded-md">
                                                    <div>
                                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Số thẻ <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="cardNumber"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                            placeholder="1234 5678 9012 3456"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Hết hạn <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="expDate"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                                placeholder="MM/YY"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                                                CVV <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="cvv"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                                placeholder="123"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Tên chủ thẻ <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="cardName"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                            placeholder="NGUYEN VAN A"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Đang xử lý...
                                                </span>
                                            ) : (
                                                `${paymentMethod === 'cod' ? 'Đặt hàng' : 'Thanh toán'} ${formatPrice(orderData?.total || 0)}`
                                            )}
                                        </button>

                                        <p className="text-sm text-gray-600 mt-3 text-center">
                                            Bằng cách nhấn nút "{paymentMethod === 'cod' ? 'Đặt hàng' : 'Thanh toán'}", bạn đồng ý với{' '}
                                            <a href="#" className="text-orange-600 hover:text-orange-700">điều khoản và điều kiện</a> của chúng tôi.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}