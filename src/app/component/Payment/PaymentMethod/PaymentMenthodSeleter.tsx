import React from "react";
import { FaMoneyBillWave, FaCreditCard, FaWallet } from "react-icons/fa";

interface PaymentMethodSelectorProps {
  selected: string;
  onChange: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="space-y-3">
      <div
        className={`border ${
          selected === "wallet"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300"
        } rounded-md p-3 flex items-center cursor-pointer`}
        onClick={() => onChange("wallet")}
      >
        <div
          className={`w-5 h-5 rounded-full border ${
            selected === "wallet" ? "border-orange-500" : "border-gray-400"
          } flex items-center justify-center`}
        >
          {selected === "wallet" && (
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="font-medium flex items-center">
            <FaWallet className="text-green-600 mr-2" />
            Thanh toán bằng tiền trong ví
          </div>
          <p className="text-sm text-gray-600">
            Sử dụng số dư có sẵn trong ví của bạn
          </p>
        </div>
      </div>

      <div
        className={`border ${
          selected === "cod"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300"
        } rounded-md p-3 flex items-center cursor-pointer`}
        onClick={() => onChange("cod")}
      >
        <div
          className={`w-5 h-5 rounded-full border ${
            selected === "cod" ? "border-orange-500" : "border-gray-400"
          } flex items-center justify-center`}
        >
          {selected === "cod" && (
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="font-medium flex items-center">
            <FaMoneyBillWave className="text-green-600 mr-2" />
            Thanh toán khi nhận hàng (COD)
          </div>
          <p className="text-sm text-gray-600">
            Thanh toán bằng tiền mặt khi nhận hàng
          </p>
        </div>
      </div>

      <div
        className={`border ${
          selected === "zalopay"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300"
        } rounded-md p-3 flex items-center cursor-pointer`}
        onClick={() => onChange("zalopay")}
      >
        <div
          className={`w-5 h-5 rounded-full border ${
            selected === "zalopay" ? "border-orange-500" : "border-gray-400"
          } flex items-center justify-center`}
        >
          {selected === "zalopay" && (
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="font-medium flex items-center">
            <FaCreditCard className="text-blue-600 mr-2" />
            Thanh toán qua Zalopay
          </div>
          <p className="text-sm text-gray-600">
            Thanh toán trực tuyến bằng Zalopay
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;