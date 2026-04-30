import React, { useState, useRef, useEffect } from "react";

const VendorNavbar = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

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
                    className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-semibold cursor-pointer"
                >
                    S
                </div>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 z-50">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                            Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default VendorNavbar;