import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import RegisterVendor from "./pages/Vendor/RegisterVendor";
import VendorLogin from "./pages/Vendor/VendorLogin";

import VendorDashboard from "./pages/Vendor/VendorDashboard";
import DashboardHome from "./pages/Vendor/DashboardHome";
import AddProduct from "./pages/Vendor/AddProduct";
import Orders from "./pages/Vendor/Orders";
import Payment from "./pages/Vendor/Payment";
import VendorProfile from "./pages/Vendor/VendorProfile";
 import MyProfile from "./pages/customer/MyProfile"
 import Cart from "./pages/customer/Cart"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register/vendor" element={<RegisterVendor />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/profile" element={<VendorProfile />} />

        {/* ✅ Layout Route */}
        <Route path="/vendor" element={<VendorDashboard />}>

          {/* Default redirect */}
          <Route index element={<Navigate to="dashboard" />} />
          

          {/* Pages */}
          <Route path="dashboard" element={<DashboardHome />} />

          <Route path="add/product" element={<AddProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payment" element={<Payment />} />




        </Route>
      </Routes>
    </Router>
  );
}

export default App;