import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { deleteProduct, getVendorProducts } from "../../features/productSlice";
import { toast, ToastContainer } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";          

const AddProduct = () => {
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const { products = [], loading } = useSelector((state) => state.product);

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getVendorProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((item) =>
    item.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (item) => {
    setSelectedProduct(item);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted successfully!", {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (err) {
      toast.error(`${err || "Delete failed. Please try again."}`, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen">

      {/* ✅ ToastContainer MUST be rendered somewhere in the tree */}
      <ToastContainer />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Products</h1>

        <div className="flex gap-2 w-full md:w-auto">
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

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-10 text-gray-400 text-sm">
          Loading products...
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">
          No products found.
        </div>
      )}

      {/* TABLE */}
      {!loading && filteredProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow border overflow-hidden">

          {/* DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-right">MRP</th>
                  <th className="p-3 text-center">Discount</th>
                  <th className="p-3 text-right">Final Price</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((item, index) => (
                  <tr key={item.id || index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.product_name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    </td>
                    <td className="p-3">{item.product_name}</td>
                    <td className="p-3 text-right">₹{item.mrp}</td>
                    <td className="p-3 text-center">{item.discount}%</td>
                    <td className="p-3 text-right text-indigo-600 font-semibold">
                      ₹{item.final_price}
                    </td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleEdit(item)} className="mr-2">
                        <FaEdit className="inline text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className={deletingId === item.id ? "opacity-40 cursor-not-allowed" : ""}
                      >
                        {deletingId === item.id ? (
                          <span className="inline-block w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaTrash className="inline text-red-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="md:hidden p-3 space-y-3">
            {paginatedProducts.map((item, index) => (
              <div key={item.id || index} className="border rounded-lg p-3 shadow-sm">
                <div className="flex gap-3">
                  <img
                    src={`${BASE_URL}${item.image}` || "/no-image.png"}
                    alt={item.product_name}
                    className="w-14 h-14 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product_name}</h3>
                    <p className="text-xs text-gray-500">
                      ₹{item.mrp} → ₹{item.final_price}
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
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className={deletingId === item.id ? "opacity-40 cursor-not-allowed" : ""}
                  >
                    {deletingId === item.id ? (
                      <span className="inline-block w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaTrash className="text-red-500" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ PAGINATION — moved outside the filteredProducts > 0 block, totalPages >= 1 */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* MODALS */}
      {openModal && <AddProductModal onClose={() => setOpenModal(false)} />}
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