// src/pages/AllProducts.jsx
import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const { products = [], setSearchQuery, searchQuery = "" } = useAppContext();
  const location = useLocation();

  // Keep global context in sync with URL query param (optional but helpful)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    if (q !== (searchQuery || "")) setSearchQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const effectiveQuery = (searchQuery || "").trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!effectiveQuery) return products;
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const category = (p.category || "").toLowerCase();
      return name.includes(effectiveQuery) || category.includes(effectiveQuery);
    });
  }, [products, effectiveQuery]);

  const inStockProducts = useMemo(() => filteredProducts.filter(p => p.inStock), [filteredProducts]);

  return (
    <div className="mt-16 flex flex-col px-4">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {inStockProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
          {inStockProducts.map((product, idx) => (
            <ProductCard key={`${product._id}-${idx}`} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">
          {effectiveQuery ? "No matching products found" : "No products available at the moment"}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
