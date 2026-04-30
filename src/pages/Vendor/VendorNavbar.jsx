import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";

const VendorNavbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // ✅ Get vendor from Redux
  const { vendor } = useSelector((state) => state.vendor);

  // ✅ Get first letter for avatar
  const avatarLetter = vendor?.name ? vendor.name.charAt(0).toUpperCase() : "S";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="px-4 md:px-8 py-4 flex justify-between items-center rounded-b-3xl shadow-md"
      style={{ backgroundColor: "oklch(95.3% 0.051 180.801)" }}
    >
      {/* Logo */}
      <h1 className="text-lg md:text-xl font-semibold text-gray-700">
        Logo Website
      </h1>

      {/* Avatar + Dropdown */}
      <div className="relative" ref={dropdownRef}>

        {/* Avatar */}
        <div
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold cursor-pointer"
        >
          {avatarLetter}
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">

            {/* ✅ User Info */}
            <div className="px-4 py-3 border-b bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
              <p className="text-base font-semibold text-gray-800">
                {vendor?.name || "Guest"}
              </p>
              <p className="text-sm text-gray-500">
                {vendor?.email || "No email"}
              </p>
            </div>

            {/* Profile */}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
              <CgProfile className="text-xl text-indigo-500" />
              <span className="text-sm">Profile</span>
            </button>

            {/* Logout */}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-500 transition">
              <IoIosLogOut className="text-xl text-red-500" />
              <span className="text-sm">Logout</span>
            </button>

          </div>
        )}
      </div>
    </nav>
  );
};

export default VendorNavbar;