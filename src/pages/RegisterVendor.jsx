import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { User, Mail } from "lucide-react";

// ✅ Redux
import { useDispatch, useSelector } from "react-redux";
import { registerVendor, resetVendorState } from "../features/vendorSlice";

// ✅ Toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterVendor = () => {
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.vendor
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [showMessage, setShowMessage] = useState(false); // ✅ NEW

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    dispatch(registerVendor(form));
  };

  // ✅ Toast + UI control
  useEffect(() => {
    if (success) {
      toast.success(
        "Vendor registered. Admin will approve. Check your email 📩"
      );

      setForm({
        name: "",
        email: "",
        address: "",
      });

      setShowMessage(true); // ✅ show bottom message

      // ❌ DO NOT reset immediately
      setTimeout(() => {
        dispatch(resetVendorState());
      }, 3000);
    }

    if (error) {
      toast.error(error);
      dispatch(resetVendorState());
    }
  }, [success, error, dispatch]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="bg-gradient-to-br from-purple-700 to-pink-500 text-white p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Selling Today
            </h2>

            <p className="text-sm opacity-90 mb-6">
              Join our vendor network and grow your business with us.
            </p>

            <ul className="space-y-3 text-sm">
              <li>✅ Reach more customers</li>
              <li>✅ Easy order management</li>
              <li>✅ Fast payments</li>
              <li>✅ Real-time insights</li>
            </ul>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Register as Vendor
            </h2>

            <p className="text-center text-gray-500 mb-6 text-sm">
              Fill your details to get started
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
                <User size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  placeholder="Name *"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>

              {/* Email */}
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
                <Mail size={18} className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>

              {/* Address */}
              <textarea
                name="address"
                placeholder="Address *"
                value={form.address}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              />

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                  loading
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02] shadow-md"
                }`}
              >
                {loading ? "Registering..." : "Register Vendor"}
              </button>

              {/* ✅ Bottom Message FIXED */}
              {showMessage && (
                <p className="text-green-600 text-sm text-center mt-3">
                  Vendor registered. Admin will approve your request. Please check your email.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterVendor;