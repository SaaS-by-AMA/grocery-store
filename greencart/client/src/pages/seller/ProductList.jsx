import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { categories } from "../../assets/assets";

const ProductList = () => {
  const { products, currency, axios, fetchProducts, deleteProduct, updateProduct } = useAppContext();

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "",
      category: product.category || (categories[0]?.path || ""),
      price: product.price ?? 0,
      offerPrice: product.offerPrice ?? 0,
      inStock: !!product.inStock
    });
  };

  const closeEdit = () => {
    setEditing(null);
    setForm({});
  };

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const saveEdit = async () => {
    if (!editing) return;

    const validCategory = categories.some((c) => c.path === form.category);
    if (!validCategory) {
      toast.error("Please select a valid category from the list.");
      return;
    }

    if (!form.name || String(form.name).trim().length < 2) {
      toast.error("Product name must be at least 2 characters.");
      return;
    }
    if (Number(form.price) < 0 || Number(form.offerPrice) < 0) {
      toast.error("Price values must be >= 0");
      return;
    }

    const res = await updateProduct(editing._id, {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      offerPrice: Number(form.offerPrice),
      inStock: !!form.inStock
    });

    if (res.success) closeEdit();
  };

  const confirmDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this product? This cannot be undone.")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      // no further action; context already removed it
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          {/* Responsive table container */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="px-2 md:px-4 py-3 font-semibold min-w-[180px]">Product</th>
                  <th className="px-2 md:px-4 py-3 font-semibold min-w-[120px]">Category</th>
                  <th className="px-2 md:px-4 py-3 font-semibold min-w-[100px] hidden sm:table-cell">Price</th>
                  <th className="px-2 md:px-4 py-3 font-semibold min-w-[100px]">In Stock</th>
                  <th className="px-2 md:px-4 py-3 font-semibold min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-500/20">
                    <td className="px-2 md:px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 border border-gray-300 rounded p-1">
                          <img 
                            src={product.image?.[0] || "/placeholder.png"} 
                            alt="Product" 
                            className="w-12 h-12 md:w-16 md:h-16 object-cover" 
                          />
                        </div>
                        <span className="truncate max-w-[120px] md:max-w-[180px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-3 truncate max-w-[120px]">{product.category}</td>
                    <td className="px-2 md:px-4 py-3 hidden sm:table-cell">{currency}.{product.offerPrice}</td>
                    <td className="px-2 md:px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                        <input
                          onChange={async ()=> {
                            await updateProduct(product._id, { inStock: !product.inStock });
                          }}
                          checked={product.inStock}
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200"></div>
                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </label>
                    </td>
                    <td className="px-2 md:px-4 py-3">
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        <button onClick={() => openEdit(product)} className="px-2 py-1 border rounded text-xs md:text-sm">Edit</button>
                        <button onClick={() => confirmDelete(product._id)} className="px-2 py-1 border rounded text-xs md:text-sm text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit}></div>
          <div className="bg-white rounded-md p-6 z-10 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-3">Edit Product</h3>
            <div className="flex flex-col gap-2">
              <label>Product name</label>
              <input value={form.name} onChange={(e)=> onChange("name", e.target.value)} className="border rounded px-2 py-1" />

              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => onChange("category", e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="" disabled>Choose category</option>
                {categories.map((c, idx) => (
                  <option key={idx} value={c.path}>
                    {c.path}
                  </option>
                ))}
              </select>

              <label>Price</label>
              <input type="number" value={form.price} onChange={(e)=> onChange("price", e.target.value)} className="border rounded px-2 py-1" />

              <label>Offer Price</label>
              <input type="number" value={form.offerPrice} onChange={(e)=> onChange("offerPrice", e.target.value)} className="border rounded px-2 py-1" />

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.inStock} onChange={(e)=> onChange("inStock", e.target.checked)} />
                In Stock
              </label>

              <div className="flex justify-end gap-2 mt-3">
                <button onClick={closeEdit} className="px-3 py-1 border rounded">Cancel</button>
                <button onClick={saveEdit} className="px-3 py-1 bg-primary text-white rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;