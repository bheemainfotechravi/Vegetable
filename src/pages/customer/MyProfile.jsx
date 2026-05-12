import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { Package, MapPin, Wallet } from "lucide-react";

const MyProfile = () => {
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Data 👉", form);
    // API call here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="bg-white rounded-2xl shadow p-5">

          {/* Profile */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-3xl text-purple-600">
              <CgProfile />
            </div>
            <h2 className="mt-3 font-semibold text-lg">{user?.name || "User"}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Menu */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer">
              <CgProfile /> <span>Profile</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer">
              <Package /> <span>My Orders</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer">
              <Wallet /> <span>Wallet</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer">
              <MapPin /> <span>Address</span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* PROFILE FORM */}
          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-5 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Save Changes
            </button>
          </div>

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Saved Address</h3>

            <div className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">Home</p>
                <p className="text-sm text-gray-500">Indore, Madhya Pradesh</p>
              </div>
              <button className="text-purple-600 text-sm">Edit</button>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-white rounded-xl shadow p-4 text-center">
              <Package className="mx-auto text-blue-500" />
              <p className="mt-2 text-sm text-gray-500">Orders</p>
              <h4 className="font-semibold text-lg">12</h4>
            </div>

            <div className="bg-white rounded-xl shadow p-4 text-center">
              <Wallet className="mx-auto text-green-500" />
              <p className="mt-2 text-sm text-gray-500">Wallet</p>
              <h4 className="font-semibold text-lg">₹500</h4>
            </div>

            <div className="bg-white rounded-xl shadow p-4 text-center">
              <MapPin className="mx-auto text-red-500" />
              <p className="mt-2 text-sm text-gray-500">Address</p>
              <h4 className="font-semibold text-lg">2</h4>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;