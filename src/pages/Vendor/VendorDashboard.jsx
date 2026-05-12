import React, { useEffect } from "react";
import VendorNavbar from "../Vendor/VendorNavbar";
import VendorSidebar from "../Vendor/VendorSidebar";
import { toast } from "react-toastify";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutVendor } from "../../features/vendorSlice"; // ✅ use thunk, not resetVendorState

const VendorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { vendor } = useSelector((state) => state.vendor);

  useEffect(() => {
    if (!vendor) {
   
      setTimeout(() => navigate("/vendor/login"), 1500);
    }
  }, [vendor, navigate]);

  const handleLogout = async () => {
    // ✅ logoutVendor thunk clears Redux state + removes vendorToken from localStorage
    await dispatch(logoutVendor());
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/vendor/login"), 1500);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(96.2% 0.018 272.314)" }}
    >
      {/* Navbar */}
      <VendorNavbar onLogout={handleLogout} />

      {/* Sidebar */}
      <VendorSidebar />

      {/* Dynamic Content */}
      <div className="ml-24 pt-24 px-6">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorDashboard;