import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { deleteProduct } from "../../features/productSlice";
import { toast } from "react-toastify";

const AddProduct = () => {
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { products } = useSelector((state) => state.product);

  const itemsPerPage = 5;

  // ✅ Dummy fallback
  const dummyProducts = [
    {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
      {
      image: "https://via.placeholder.com/100",
      name: "Apple iPhone 14",
      mrp: 80000,
      discount: 10,
      quantity: 5,
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Samsung Galaxy S23",
      mrp: 70000,
      discount: 15,
      quantity: 8,
    },
  ];

  const allProducts =
    products && products.length > 0 ? products : dummyProducts;

  // ✅ SEARCH FILTER
  const filteredProducts = allProducts.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getFinalPrice = (mrp, discount) =>
    Math.round(mrp - (mrp * discount) / 100);

  // EDIT
  const handleEdit = (item) => {
    setSelectedProduct(item);
    setEditModalOpen(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Products</h1>

        <div className="flex gap-2 w-full md:w-auto">
          {/* SEARCH */}
          <div className="flex items-center border rounded-md px-2 bg-white w-full md:w-64">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 outline-none text-sm"
            />
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
          >
            + Add 
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-right">MRP</th>
                <th className="p-3 text-center">Discount</th>
                <th className="p-3 text-right">Final</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((item, index) => (
                <tr key={item._id || index} className="border-b">
                  <td className="p-3">
                    <img src={item.image} className="w-10 h-10 rounded" />
                  </td>
                  <td>{item.name}</td>
                  <td className="text-right">₹{item.mrp}</td>
                  <td className="text-center">{item.discount}%</td>
                  <td className="text-right text-indigo-600 font-semibold">
                    ₹{getFinalPrice(item.mrp, item.discount)}
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">
                    <button onClick={() => handleEdit(item)}>
                      <FaEdit className="inline text-blue-500 mx-1" />
                    </button>
                    <button onClick={() => handleDelete(item._id)}>
                      <FaTrash className="inline text-red-500 mx-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden p-3 space-y-3">
          {paginatedProducts.map((item, index) => (
            <div
              key={item._id || index}
              className="border rounded-lg p-3 shadow-sm"
            >
              <div className="flex gap-3">
                <img src={item.image} className="w-14 h-14 rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-xs text-gray-500">
                    ₹{item.mrp} → ₹{getFinalPrice(item.mrp, item.discount)}
                  </p>
                  <p className="text-xs">
                    Discount: {item.discount}% | Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button onClick={() => handleEdit(item)}>
                  <FaEdit className="text-blue-500" />
                </button>
                <button onClick={() => handleDelete(item._id)}>
                  <FaTrash className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODALS */}
      {openModal && (
        <AddProductModal onClose={() => setOpenModal(false)} />
      )}

      {editModalOpen && (
        <EditProductModal
          onClose={() => setEditModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default AddProduct;