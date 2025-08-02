import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    
    const [isSeller, setIsSeller] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Cart state initialized from localStorage
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('guestCart');
            return savedCart ? JSON.parse(savedCart) : {};
        }
        return {};
    });

    // Fetch Seller Status
    const fetchSeller = async () => {
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            setIsSeller(data.success);
        } catch (error) {
            setIsSeller(false);
        }
    }

    // Fetch All Products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if(data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Add Product to Cart (localStorage)
    const addToCart = (itemId) => {
        setCartItems(prevItems => {
            const newItems = {...prevItems};
            newItems[itemId] = (newItems[itemId] || 0) + 1;
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('guestCart', JSON.stringify(newItems));
            }
            
            toast.success("Added to Cart");
            return newItems;
        });
    }

    // Update Cart Item Quantity (localStorage)
    const updateCartItem = (itemId, quantity) => {
        setCartItems(prevItems => {
            const newItems = {...prevItems};
            
            if (quantity <= 0) {
                delete newItems[itemId];
            } else {
                newItems[itemId] = quantity;
            }
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('guestCart', JSON.stringify(newItems));
            }
            
            toast.success("Cart Updated");
            return newItems;
        });
    }

    // Remove Product from Cart (localStorage)
    const removeFromCart = (itemId) => {
        setCartItems(prevItems => {
            const newItems = {...prevItems};
            
            if (newItems[itemId]) {
                newItems[itemId] -= 1;
                if (newItems[itemId] <= 0) {
                    delete newItems[itemId];
                }
            }
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('guestCart', JSON.stringify(newItems));
            }
            
            toast.success("Removed from Cart");
            return newItems;
        });
    }

    // Clear entire cart
    const clearCart = () => {
        setCartItems({});
        if (typeof window !== 'undefined') {
            localStorage.removeItem('guestCart');
        }
    }

    // Get Cart Item Count
    const getCartCount = () => {
        return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
    }

    // Get Cart Total Amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find(product => product._id === itemId);
            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[itemId];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchSeller();
        fetchProducts();
    }, []);

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('guestCart', JSON.stringify(cartItems));
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
        setCartItems
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}