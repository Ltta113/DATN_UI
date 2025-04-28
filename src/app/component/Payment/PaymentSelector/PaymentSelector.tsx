import React, { useState, useEffect } from "react";
import { FaCreditCard } from "react-icons/fa";
import { usePayOS } from "@payos/payos-checkout";

interface PayOSConfig {
    RETURN_URL: string;
    ELEMENT_ID: string;
    CHECKOUT_URL: string | null;
    embedded: boolean;
    onSuccess: (event: Event) => void;
}

const PaymentSelector = () => {
    const [selectedAmount, setSelectedAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState<number>(0);
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false)
    const [isCreatingLink, setIsCreatingLink] = useState(false);

    const predefinedAmounts = [
        50000, 100000, 200000, 500000, 1000000
    ];

    const [payOSConfig, setPayOSConfig] = useState<PayOSConfig>({
        RETURN_URL: window.location.href,
        ELEMENT_ID: "embedded-payment-container", // required
        CHECKOUT_URL: null, // required
        embedded: true, // Nếu dùng giao diện nhúng
        onSuccess: (event) => {
            setIsOpen(false);
            setMessage("Thanh toán thành công");
        },
    });

    const { open, exit } = usePayOS(payOSConfig);

    const handleAmountSelect = (amount: number): void => {
        setSelectedAmount(amount);
        setIsCustomAmount(false);
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let value: string = e.target.value.replace(/\D/g, "");
        setCustomAmount(parseInt(value, 10));

        if (value) {
            setSelectedAmount(parseInt(value, 10));
        } else {
            setSelectedAmount(0);
        }
    };

    const enableCustomAmount = () => {
        setIsCustomAmount(true);
        setSelectedAmount(0);
        setCustomAmount(0);
    };

    // Hàm tạo link thanh toán
    const handleGetPaymentLink = async () => {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/api/user/transactions/deposit", {
            method: "POST",
            body: JSON.stringify({
                amount: selectedAmount,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.log("Server doesn't respond");
            return;
        }

        const result = await response.json();
        console.log(result.checkoutUrl);
        setPayOSConfig((oldConfig) => ({
            ...oldConfig,
            CHECKOUT_URL: result.checkoutUrl,
        }));

        setIsOpen(true);
        setIsCreatingLink(false);
    };

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL) {
            open();
        }
    }, [payOSConfig]);

    const formatAmount = (amount: number | string): string => {
        return amount.toLocaleString("vi-VN");
    };

    return message ? (
        <Message message={message} />
    ) : (
        <div className="w-3/7 mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Nạp tiền vào tài khoản</h2>

            {/* Phần chọn mệnh giá */}
            <div className="mb-6">
                <span className="block text-gray-700 font-medium mb-3">
                    Chọn số tiền nạp
                </span>
                <div className="grid grid-cols-3 gap-2 mb-3">
                    {predefinedAmounts.map((amount) => (
                        <div
                            key={amount}
                            onClick={() => handleAmountSelect(amount)}
                            className={`border rounded-md p-3 text-center cursor-pointer ${selectedAmount === amount && !isCustomAmount
                                ? "border-orange-500 bg-orange-50 text-orange-600"
                                : "border-gray-300 hover:border-orange-300"
                                }`}
                        >
                            {formatAmount(amount)} VNĐ
                        </div>
                    ))}
                    <div
                        onClick={enableCustomAmount}
                        className={`border rounded-md p-3 text-center cursor-pointer ${isCustomAmount
                            ? "border-orange-500 bg-orange-50 text-orange-600"
                            : "border-gray-300 hover:border-orange-300"
                            }`}
                    >
                        Số khác
                    </div>
                </div>

                {/* Phần nhập số tiền tùy chọn */}
                {isCustomAmount && (
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                                placeholder="Nhập số tiền"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                autoFocus
                            />
                            <span className="absolute right-3 top-3 text-gray-500">VNĐ</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Số tiền tối thiểu: 10,000 VNĐ</p>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <label htmlFor="payment-method" className="block text-gray-700 font-medium mb-3">
                    Phương thức thanh toán
                </label>

                <div className="space-y-3">
                    <div
                        className={`border rounded-md p-3 flex items-center cursor-pointer`}
                    >
                        <div
                            className={`w-5 h-5 rounded-full border border-orange-500 flex items-center justify-center`}
                        >
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        </div>
                        <div className="ml-3 flex-1" id="payment-method">
                            <div className="font-medium flex items-center">
                                <FaCreditCard className="text-blue-600 mr-2" />
                                Thanh toán qua Payos
                            </div>
                            <p className="text-sm text-gray-600">
                                Thanh toán trực tuyến bằng Payos
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nút xác nhận */}
            <button
                disabled={!selectedAmount}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${selectedAmount ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-300 cursor-not-allowed"
                    }`}
                onClick={handleGetPaymentLink}
            >
                Xác nhận nạp tiền
            </button>
            <div className="flex">
                {!isOpen ? (
                    <div>
                        {isCreatingLink ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "10px",
                                    fontWeight: "600",
                                }}
                            >
                                Creating Link...
                            </div>
                        ) : (
                            <button
                                id="create-payment-link-btn"
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleGetPaymentLink();
                                }}
                            >
                                Tạo Link thanh toán Embedded
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        <button
                            style={{
                                backgroundColor: "gray",
                                color: "white",
                                width: "100%",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                fontSize: "14px",
                                marginTop: "5px",
                            }}
                            onClick={(event) => {
                                event.preventDefault();
                                setIsOpen(false);
                                exit();
                            }}
                        >
                            Đóng Link
                        </button>
                    </div>
                )}

                {isOpen && (
                    <div style={{ maxWidth: "400px", padding: "2px" }}>
                        Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
                        hệ thống tự động cập nhật.
                    </div>
                )}
                <div
                    id="embedded-payment-container"
                    style={{
                        height: "350px",
                    }}
                ></div>
            </div>
        </div>
    );
};

// Component Message để hiển thị thông báo thanh toán thành công
const Message = ({ message }: { message: string }) => (
    <div className="w-3/7 mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="checkout">
            <div className="product" style={{ textAlign: "center", fontWeight: "500" }}>
                <p>{message}</p>
            </div>
            <form action="/">
                <button type="submit" className="w-full py-3 px-4 rounded-md text-white font-medium bg-orange-500 hover:bg-orange-600">
                    Quay lại trang thanh toán
                </button>
            </form>
        </div>
    </div>
);

export default PaymentSelector;
