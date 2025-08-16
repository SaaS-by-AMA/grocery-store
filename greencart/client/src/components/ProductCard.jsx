import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems,decreaseQty, navigate } =
    useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/products/${product.category.toLowerCase()}/${product._id}`
          );
          scrollTo(0, 0);
        }}
        className="
        w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg 
        bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 
        cursor-pointer overflow-hidden flex flex-col transition-shadow
        mx-auto
      "
      >
        {/* Image Container - Fixed Size */}
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-50 flex items-center justify-center p-3">
          <img
            className="w-full h-full object-contain transition-transform hover:scale-105"
            src={product.image[0]}
            alt={product.name}
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="text-gray-800 font-semibold text-base sm:text-lg md:text-xl line-clamp-2 h-[3rem] sm:h-[3.6rem] mb-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-4 sm:w-5"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt={i < 4 ? "star" : "star empty"}
                  aria-hidden="true"
                />
              ))}
            <span className="text-xs sm:text-sm text-gray-500 ml-1">(4)</span>
          </div>

          {/* Price and Add to Cart */}
          <div className="mt-auto flex items-end justify-between">
            <div>
              <p className="text-sm sm:text-lg font-semibold text-primary">
                {currency}.{product.offerPrice}
              </p>
              {product.offerPrice < product.price && (
                <p className="text-xs sm:text-sm text-gray-400 line-through">
                  {currency}.{product.price}
                </p>
              )}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              {!cartItems[product._id] ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary/10 hover:bg-primary/20 border border-primary/40 px-3 py-2 rounded-full text-sm sm:text-base font-medium text-primary transition-colors select-none"
                  onClick={() => addToCart(product._id)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <img
                    src={assets.cart_icon}
                    alt="cart icon"
                    className="w-5 sm:w-6"
                  />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-between gap-3 w-28 h-10 bg-primary/10 rounded-full px-3 select-none">
                  <button
                    onClick={() => decreaseQty(product._id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors text-primary font-bold text-lg"
                    aria-label={`Remove one ${product.name} from cart`}
                  >
                    –
                  </button>
                  <span className="text-base font-semibold">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors text-primary font-bold text-lg"
                    aria-label={`Add one more ${product.name} to cart`}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
