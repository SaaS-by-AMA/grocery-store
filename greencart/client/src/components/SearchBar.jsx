// src/components/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const encode = (s = "") => encodeURIComponent(String(s || "").trim());

const SearchIcon = ({ className = "w-5 h-5", ariaHidden = true }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden={ariaHidden}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="6" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/**
 * Always-visible minimal SearchBar:
 * - Icon-only clickable action always shown (no responsive 'hidden' classes)
 * - Press Enter or click icon -> navigate to /products?search=...
 * - Escape clears input
 * - Input cleared after search
 */
const SearchBar = ({ className = "", inputClassName = "", initial = "", compact = false }) => {
  const [value, setValue] = useState(initial);
  const navigate = useNavigate();

  const doSearch = (q) => {
    const qtrim = String(q || "").trim();
    if (!qtrim) return;
    navigate(`/products?search=${encode(qtrim)}`);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch(value);
    } else if (e.key === "Escape") {
      setValue("");
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>

      <div
        className={`relative flex items-center rounded-full border border-gray-200 bg-white overflow-hidden ${
          compact ? "px-2 py-1.5" : "px-3 py-2"
        } shadow-sm`}
      >
        {/* left hint icon */}
        <div className="pointer-events-none mr-2 text-gray-400">
          <SearchIcon className="w-5 h-5" />
        </div>

        {/* input */}
        <input
          id="site-search"
          name="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search products"
          className={`flex-1 bg-transparent outline-none text-sm ${inputClassName}`}
          type="text"
          aria-label="Search products"
        />

        {/* icon-only clickable action (ALWAYS visible) */}
        <button
          type="button"
          onClick={() => doSearch(value)}
          aria-label="Search"
          className="ml-2 inline-flex items-center cursor-pointer justify-center p-2 rounded-full text-white bg-primary hover:bg-primary-dull transition"
        >
          <SearchIcon className="w-4 h-4 text-white" ariaHidden={false} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
