import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    getCartAmount,
    clearCart,
    navigate
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);

  // Convert cart items to array format for display
  const getCart = () => {
    const tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        tempArray.push({
          ...product,
          quantity: cartItems[key]
        });
      }
    }
    setCartArray(tempArray);
  };

  const placeOrder = async () => {
    try {
      // In a real implementation, you would:
      // 1. Collect address/payment info
      // 2. Submit to your order API
      // 3. Clear cart on success
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/"); // Redirect to home or confirmation page
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
    }
  };

  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {
      getCart();
    } else {
      setCartArray([]);
    }
  }, [products, cartItems]);

  if (products.length === 0) {
    return <div className="mt-16 text-center">Loading products...</div>;
  }

  if (cartArray.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center min-h-[50vh]">
        <img 
          src={assets.empty_cart} 
          alt="Empty cart" 
          className="w-40 h-40 mb-4"
        />
        <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse our products to add items</p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row mt-16 px-4">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid bg-[#f2f2f2] mx-2 grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base hover:bg-[#dde2dd] transition-all duration-200 group rounded font-medium pt-3 mb-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product._id}`)}
                className="cursor-pointer w-20 h-20 flex items-center justify-center border border-gray-300 rounded ml-2 mb-2 -mt-1"
              >
                <img
                  className="max-w-full h-full object-cover group-hover:scale-105 transition-transform duration-250 rounded-sm"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>Weight: {product.weight || "N/A"}</p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                      value={product.quantity}
                      className="outline-none bg-transparent"
                    >
                      {[...Array(10).keys()].map((qty) => (
                        <option key={qty + 1} value={qty + 1}>
                          {qty + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {(product.offerPrice * product.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
              aria-label="Remove item"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 rounded-lg">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-3" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {currency}
              {getCartAmount().toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 0.02).toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total:</span>
            <span>
              {currency}
              {(getCartAmount() * 1.02).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition rounded"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;