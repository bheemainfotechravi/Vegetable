import React from "react";
import { FaCheckCircle, FaClock, FaShippingFast } from "react-icons/fa";

const DashboardHome = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        
        <div className="p-5 rounded-2xl shadow-md bg-green-100 flex justify-between items-center">
          <div>
            <p className="text-sm">Completed Orders</p>
            <h2 className="text-2xl font-bold mt-2">86</h2>
          </div>
          <FaCheckCircle className="text-3xl" />
        </div>

        <div className="p-5 rounded-2xl shadow-md bg-yellow-100 flex justify-between items-center">
          <div>
            <p className="text-sm">Pending Orders</p>
            <h2 className="text-2xl font-bold mt-2">14</h2>
          </div>
          <FaClock className="text-3xl" />
        </div>

        <div className="p-5 rounded-2xl shadow-md bg-blue-100 flex justify-between items-center">
          <div>
            <p className="text-sm">Live Orders</p>
            <h2 className="text-2xl font-bold mt-2">92%</h2>
          </div>
          <FaShippingFast className="text-3xl" />
        </div>

      </div>
    </>
  );
};

export default DashboardHome;