import React, { useState } from "react";
import AddProductModal from "./AddProductModal";

const AddProduct = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [products, setProducts] = useState([
    {
      image: "https://via.placeholder.com/100",
      name: "iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung TV",
      mrp: 50000,
      discount: 15,
      quantity: 8,
    },
  ]);

  const getFinalPrice = (mrp, discount) => {
    return Math.round(mrp - (mrp * discount) / 100);
  };

  const handleAddProduct = (product) => {
    const newProduct = {
      ...product,
      mrp: Number(product.mrp),
      discount: Number(product.discount),
      quantity: Number(product.quantity),
    };

    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = newProduct;
      setProducts(updated);
      setEditIndex(null);
    } else {
      setProducts([...products, newProduct]);
    }

    setOpenModal(false);
  };

  const handleDelete = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setOpenModal(true);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* 🔥 HEADER BACK (Button Fix) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Products
        </h1>

        <button
          onClick={() => {
            setEditIndex(null);
            setOpenModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            
            <thead className="bg-gray-100 text-gray-700 uppercase text-[11px]">
              <tr>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-right">MRP</th>
                <th className="px-4 py-2 text-center">Discount</th>
                <th className="px-4 py-2 text-right">Final</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">

                  <td className="px-4 py-2">
                    <img
                      src={item.image}
                      className="w-10 h-10 rounded object-cover border"
                    />
                  </td>

                  <td className="px-4 py-2 font-medium">{item.name}</td>

                  <td className="px-4 py-2 text-right">₹{item.mrp}</td>

                  <td className="px-4 py-2 text-center">
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-[10px]">
                      {item.discount}%
                    </span>
                  </td>

                  <td className="px-4 py-2 text-right font-semibold text-indigo-600">
                    ₹{getFinalPrice(item.mrp, item.discount)}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-[10px]">
                      {item.quantity}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No products added
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <AddProductModal
          onClose={() => {
            setOpenModal(false);
            setEditIndex(null);
          }}
          onSave={handleAddProduct}
          editData={editIndex !== null ? products[editIndex] : null}
        />
      )}
    </div>
  );
};

export default AddProduct;