import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState("");
  const menuRef = useRef();
  const hamburgerRef = useRef();

  const {
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
  } = useAppContext();

useEffect(() => {
  if (searchQuery.length > 0 && window.location.pathname !== "/products") {
    navigate("/products");
  }
}, [searchQuery, navigate]);


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Handles mobile search submission
  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchValue.trim().length > 0) {
      setSearchQuery(mobileSearchValue.trim());
      setMobileSearch(false);
      setOpen(false);
    }
  };

  // Animation variants for menu container
  const menuContainerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  // Animation variants for each menu item
  const menuItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.2,
      },
    },
  };

  // Animation variants for hamburger icon
  const iconVariants = {
    open: { rotate: 180, scale: 1.1 },
    closed: { rotate: 0, scale: 1 },
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-50">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img className="h-11" src={assets.logo} alt="logo" />
        </NavLink>

        <div className="hidden sm:flex items-center gap-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">All Products</NavLink>
          <NavLink to="/">Contact Us</NavLink>

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>

          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          {/* Avatar icon (optional) */}
         
        </div>

        <div className="flex items-center gap-6 sm:hidden">
          {/* Mobile search icon */}
          <button
            onClick={() => {
              setMobileSearch((prev) => !prev);
              setOpen(false);
            }}
            aria-label="Search"
            className="focus:outline-none"
          >
            <img src={assets.search_icon} alt="search" className="w-6 h-6" />
          </button>
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>
          <motion.button
            ref={hamburgerRef}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="focus:outline-none p-1"
            animate={open ? "open" : "closed"}
            variants={iconVariants}
            transition={{ duration: 0.3 }}
          >
            <img src={assets.menu_icon} alt="menu" />
          </motion.button>
        </div>

        {/* Mobile search overlay */}
        {mobileSearch && (
          <div
            className="absolute left-0 top-0 w-full bg-white z-40 sm:hidden shadow-md"
            style={{ borderRadius: "0 0 12px 12px" }}
          >
            <form
              className="flex items-center px-4 py-3 gap-2"
              onSubmit={handleMobileSearch}
            >
              <input
                type="text"
                className="flex-1 py-2 px-3 rounded-full border border-gray-300 outline-none text-base"
                placeholder="Search products"
                autoFocus
                value={mobileSearchValue}
                onChange={(e) => setMobileSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setMobileSearch(false);
                }}
              />
              <button
                type="submit"
                className="bg-primary text-white rounded-full px-4 py-2 font-medium hover:bg-primary-dull transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setMobileSearch(false)}
                aria-label="Close"
                className="ml-2"
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l10 10M6 16L16 6" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* Animated Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              className="absolute top-[60px] left-0 w-full bg-white shadow-lg rounded-b-lg py-4 flex-col items-start gap-3 px-5 text-sm md:hidden z-40 overflow-hidden border-t border-gray-100"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuContainerVariants}
            >
              <motion.div variants={menuItemVariants}>
                <NavLink 
                  to="/" 
                  onClick={() => setOpen(false)}
                  className="block w-full p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Home
                </NavLink>
              </motion.div>
              
              <motion.div variants={menuItemVariants}>
                <NavLink 
                  to="/products" 
                  onClick={() => setOpen(false)}
                  className="block w-full p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  All Products
                </NavLink>
              </motion.div>
              
              <motion.div variants={menuItemVariants}>
                <NavLink 
                  to="/" 
                  onClick={() => setOpen(false)}
                  className="block w-full p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Contact Us
                </NavLink>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;