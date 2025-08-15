import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Cart state initialized from localStorage
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("guestCart");
      return savedCart ? JSON.parse(savedCart) : {};
    }
    return {};
  });

  // Fetch Seller Status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch (error) {
      setIsSeller(false);
    }
  };

  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete product permanently (for seller)
  const deleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(`/api/product/${id}`);
      if (data.success) {
        // remove from local products state
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success(data.message);
        return { success: true };
      } else {
        toast.error(data.message);
        return { success: false };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // Update product (partial update) (for seller)
  const updateProduct = async (id, updates) => {
    try {
      const { data } = await axios.patch(`/api/product/${id}`, updates);
      if (data.success) {
        // replace product in state
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? data.product : p))
        );
        toast.success(data.message);
        return { success: true, product: data.product };
      } else {
        toast.error(data.message);
        return { success: false };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return { success: false };
    }
  };

  // Add Product to Cart (localStorage)
  const addToCart = (itemId) => {
    setCartItems((prevItems) => {
      const newItems = { ...prevItems };
      newItems[itemId] = (newItems[itemId] || 0) + 1;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("guestCart", JSON.stringify(newItems));
      }

      toast.success("Added to Cart");
      return newItems;
    });
  };

  // Update Cart Item Quantity (localStorage)
  const updateCartItem = (itemId, quantity) => {
    setCartItems((prevItems) => {
      const newItems = { ...prevItems };

      if (quantity <= 0) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = quantity;
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("guestCart", JSON.stringify(newItems));
      }

      toast.success("Cart Updated");
      return newItems;
    });
  };

  // Increase item quantity by 1
  const increaseQty = (itemId) => {
    const currentQty = cartItems[itemId] || 0;
    updateCartItem(itemId, currentQty + 1);
  };

  // Decrease item quantity by 1
  const decreaseQty = (itemId) => {
    const currentQty = cartItems[itemId] || 0;
    if (currentQty > 1) {
      updateCartItem(itemId, currentQty - 1);
    } else {
      // Optional: remove item completely if quantity is 1
      removeFromCart(itemId);
    }
  };

  // Remove Product from Cart (localStorage)
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const newItems = { ...prevItems };

      if (newItems[itemId]) {
        delete newItems[itemId];
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("guestCart", JSON.stringify(newItems));
      }

      toast.success("Removed from Cart");
      return newItems;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems({});
    if (typeof window !== "undefined") {
      localStorage.removeItem("guestCart");
    }
  };

  // Get Cart Item Count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  // Get Cart Total Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchSeller();
    fetchProducts();
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("guestCart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const value = {
    navigate,
    isSeller,
    setIsSeller,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    deleteProduct,
    updateProduct,
    setCartItems,
    decreaseQty,
    increaseQty,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
