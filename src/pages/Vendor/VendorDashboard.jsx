import React, { useEffect } from "react";
import VendorNavbar from "../Vendor/VendorNavbar";
import VendorSidebar from "../Vendor/VendorSidebar";
import { toast } from "react-toastify";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetVendorState } from "../../features/vendorSlice";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { vendor } = useSelector((state) => state.vendor);

  useEffect(() => {
    if (!vendor) {
      toast.error("Please login first");
      setTimeout(() => navigate("/vendor/login"), 1500);
    }
  }, [vendor]);

  const handleLogout = () => {
    dispatch(resetVendorState());
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