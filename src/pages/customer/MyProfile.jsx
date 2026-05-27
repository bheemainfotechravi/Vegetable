import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { Package, MapPin, Wallet, Edit3, Save, ChevronRight, Star, ShoppingBag } from "lucide-react";
import Navbar from "../../components/Navbar";

const MyProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    console.log("Updated Data 👉", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const menuItems = [
    { id: "profile", label: "My Profile",  icon: <CgProfile size={17} />,  color: "text-purple-500", bg: "bg-purple-50" },
    { id: "orders",  label: "My Orders",   icon: <Package   size={17} />,  color: "text-blue-500",   bg: "bg-blue-50"   },
    { id: "wallet",  label: "Wallet",      icon: <Wallet    size={17} />,  color: "text-green-500",  bg: "bg-green-50"  },
    { id: "address", label: "Address",     icon: <MapPin    size={17} />,  color: "text-red-400",    bg: "bg-red-50"    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ── TOP BANNER ── */}
          <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-2xl p-6 sm:p-8 overflow-hidden">
            {/* decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-6 w-32 h-32 bg-white/10 rounded-full" />

            <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg flex-shrink-0">
                {getInitials(user?.name)}
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">{user?.name || "User"}</h1>
                <p className="text-purple-200 text-sm mt-0.5">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-2 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                  <Star size={11} className="fill-yellow-300 text-yellow-300" /> Premium Member
                </span>
              </div>

              {/* Quick stats inline */}
              <div className="sm:ml-auto flex gap-4 sm:gap-6 text-center">
                {[
                  { val: "12", lbl: "Orders" },
                  { val: "₹500", lbl: "Wallet" },
                  { val: "2",  lbl: "Addresses" },
                ].map(({ val, lbl }) => (
                  <div key={lbl}>
                    <p className="text-xl font-bold text-white">{val}</p>
                    <p className="text-xs text-purple-200">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sticky top-24">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu</p>
                <nav className="space-y-1">
                  {menuItems.map(({ id, label, icon, color, bg }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === id
                          ? `${bg} ${color} shadow-sm`
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`${activeTab === id ? color : "text-gray-400"}`}>{icon}</span>
                        {label}
                      </div>
                      <ChevronRight size={14} className={activeTab === id ? color : "text-gray-300"} />
                    </button>
                  ))}
                </nav>

                {/* Logout hint */}
                <div className="mt-4 pt-4 border-t border-gray-100 px-3">
                  <p className="text-xs text-gray-400">Member since 2024</p>
                </div>
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="lg:col-span-3 space-y-5">

              {/* ── EDIT PROFILE FORM ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-800">Edit Profile</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Update your personal details</p>
                  </div>
                  <span className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                    <Edit3 size={15} />
                  </span>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {[
                      { label: "Full Name",     name: "name",  type: "text",  placeholder: "John Doe"           },
                      { label: "Email Address", name: "email", type: "email", placeholder: "john@example.com"   },
                      { label: "Phone Number",  name: "phone", type: "text",  placeholder: "+91 98765 43210"    },
                    ].map(({ label, name, type, placeholder }) => (
                      <div key={name} className={name === "email" ? "" : ""}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                          {label}
                        </label>
                        <input
                          type={type}
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          className="w-full px-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-purple-300 transition-all placeholder-gray-300"
                        />
                      </div>
                    ))}

                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-sm ${
                        saved
                          ? "bg-green-500 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                    >
                      <Save size={15} />
                      {saved ? "Saved!" : "Save Changes"}
                    </button>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* ── SAVED ADDRESS ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-800">Saved Addresses</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Manage your delivery addresses</p>
                  </div>
                  <button className="text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors">
                    + Add New
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  {[
                    { tag: "Home",   addr: "Indore, Madhya Pradesh – 452001",   tagColor: "bg-green-100 text-green-700"  },
                    { tag: "Work",   addr: "Vijay Nagar, Indore – 452010",      tagColor: "bg-blue-100 text-blue-700"   },
                  ].map(({ tag, addr, tagColor }) => (
                    <div
                      key={tag}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center flex-shrink-0">
                        <MapPin size={17} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tagColor}`}>{tag}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{addr}</p>
                      </div>
                      <button className="text-xs text-purple-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── QUICK STATS ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Package size={20} />, label: "Total Orders",   value: "12",   sub: "+2 this month", iconBg: "bg-blue-100",   iconColor: "text-blue-500",   accent: "from-blue-50"   },
                  { icon: <Wallet  size={20} />, label: "Wallet Balance", value: "₹500", sub: "Last topped up", iconBg: "bg-green-100",  iconColor: "text-green-600",  accent: "from-green-50"  },
                  { icon: <ShoppingBag size={20}/>,label: "Wishlist",     value: "8",    sub: "Items saved",   iconBg: "bg-orange-100", iconColor: "text-orange-500", accent: "from-orange-50" },
                ].map(({ icon, label, value, sub, iconBg, iconColor, accent }) => (
                  <div
                    key={label}
                    className={`bg-gradient-to-br ${accent} to-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow`}
                  >
                    <div className={`w-10 h-10 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center mb-3`}>
                      {icon}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
                    <p className="text-xs text-gray-400 mt-1">{sub}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;