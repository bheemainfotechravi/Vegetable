import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import RegisterVendor from "./pages/RegisterVendor";
import VendorLogin from "./pages/VendorLogin";

import VendorDashboard from "./pages/Vendor/VendorDashboard";
import DashboardHome from "./pages/Vendor/DashboardHome";
import AddProduct from "./pages/Vendor/AddProduct";
import Orders from "./pages/Vendor/Orders";
import Payment from "./pages/Vendor/Payment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/vendor" element={<RegisterVendor />} />
        <Route path="/vendor/login" element={<VendorLogin />} />

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