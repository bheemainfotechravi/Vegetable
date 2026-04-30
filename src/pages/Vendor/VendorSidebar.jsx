import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusSquare,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

const VendorSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, path: "/vendor/dashboard" },
    { icon: <PlusSquare size={20} />, path: "/vendor/add/product" },
    { icon: <ShoppingCart size={20} />, path: "/vendor/orders" },
    { icon: <CreditCard size={20} />, path: "/vendor/payment" },
  ];

  return (
    <div
      className="fixed left-3 sm:left-4 top-50 sm:top-50 shadow-lg rounded-2xl p-2 sm:p-3 flex flex-col gap-3 sm:gap-4 z-40"
      style={{ backgroundColor: "oklch(95.3% 0.051 180.801)" }}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.path)}
          className="p-2 sm:p-3 rounded-xl hover:bg-green-100 text-gray-600 transition"
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default VendorSidebar;