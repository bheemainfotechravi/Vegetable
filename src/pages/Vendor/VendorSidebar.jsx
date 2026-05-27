import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusSquare,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, path: "/vendor/dashboard", label: "Dashboard" },
  { icon: PlusSquare,      path: "/vendor/add/product", label: "Add Product" },
  { icon: ShoppingCart,    path: "/vendor/orders",       label: "Orders" },
  { icon: CreditCard,      path: "/vendor/payment",      label: "Payments" },
];

const VendorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

        .vendor-sidebar {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          background: rgba(10, 25, 41, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(20, 184, 166, 0.15);
          border-radius: 20px;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
        }

        .sidebar-track {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 14px;
          bottom: 14px;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(20,184,166,0.2) 30%, rgba(20,184,166,0.2) 70%, transparent);
          pointer-events: none;
        }

        .sidebar-btn {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 13px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(148, 163, 184, 0.7);
          transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
          outline: none;
        }

        .sidebar-btn:hover {
          color: #14b8a6;
          background: rgba(20, 184, 166, 0.1);
          transform: scale(1.08);
        }

        .sidebar-btn.active {
          color: #14b8a6;
          background: rgba(20, 184, 166, 0.15);
          border: 1px solid rgba(20, 184, 166, 0.3);
          box-shadow: 0 0 16px rgba(20, 184, 166, 0.2);
        }

        .sidebar-btn.active::before {
          content: '';
          position: absolute;
          left: -3px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: linear-gradient(to bottom, #14b8a6, #6366f1);
          border-radius: 2px;
        }

        .sidebar-tooltip {
          position: absolute;
          left: calc(100% + 14px);
          top: 50%;
          transform: translateY(-50%);
          background: rgba(10, 25, 41, 0.97);
          border: 1px solid rgba(20, 184, 166, 0.25);
          color: #e2e8f0;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          animation: tooltip-in 0.15s ease forwards;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .sidebar-tooltip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: rgba(20, 184, 166, 0.25);
        }

        @keyframes tooltip-in {
          from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>

      <aside className="vendor-sidebar">
        <div className="sidebar-track" />
        {menuItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              className={`sidebar-btn ${isActive ? "active" : ""}`}
              onClick={() => navigate(path)}
              onMouseEnter={() => setHovered(path)}
              onMouseLeave={() => setHovered(null)}
              title={label}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {hovered === path && (
                <span className="sidebar-tooltip">{label}</span>
              )}
            </button>
          );
        })}
      </aside>
    </>
  );
};

export default VendorSidebar;