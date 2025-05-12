"use client";

import { useRouter } from 'next/navigation';
import { FiAward, FiBookOpen, FiZap, FiUsers, FiStar, FiPackage } from 'react-icons/fi';


interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    route: string;
    active?: boolean;
    color?: string;
}

const NavItem = ({ icon, label, route, color }: NavItemProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(route);
    };

    return (
        <div
            className={"flex flex-col items-center px-2 py-3 cursor-pointer transition-colors text-gray-700 hover:text-black"}
            onClick={handleClick}
        >
            <div className={`rounded-lg p-3 ${color}`}>
                {icon}
            </div>
            <span className="mt-1 text-sm font-bold text-center text-nowrap">{label}</span>
        </div>
    );
};

const NavigationBar = () => {

    const currentRoute = "/";

    const navItems = [
        {
            icon: <FiZap size={30} className="bg-red-400" />,
            label: "Khuyến Mãi",
            route: "/discounts",
            color: "bg-red-400"
        },
        {
            icon: <FiBookOpen size={30} className="bg-blue-400" />,
            label: "Danh Sách Sách",
            route: "/books",
            color: "bg-blue-400"
        },
        {
            icon: <FiAward size={30} className="bg-green-400" />,
            label: "Sách Bán Chạy",
            route: "/books/best-sold",
            color: "bg-green-400"
        },
        {
            icon: <FiUsers size={30} className="bg-yellow-400" />,
            label: "Tác Giả",
            route: "/authors",
            color: "bg-yellow-400"
        },
        {
            icon: <FiStar size={30} className="bg-purple-400" />,
            label: "Sản Phẩm Mới",
            route: "books/new-products",
            color: "bg-purple-400"
        },
        {
            icon: <FiPackage size={30} className="bg-orange-400" />,
            label: "Combo",
            route: "/combos",
            color: "bg-orange-400"
        }
    ];

    return (
        <div className="w-full bg-gray-100 shadow-sm rounded-md">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex overflow-x-auto scrollbar-hide py-2 justify-between items-center">
                    {navItems.map((item, index) => (
                        <NavItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            route={item.route}
                            active={item.route === currentRoute}
                            color={item.color}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;