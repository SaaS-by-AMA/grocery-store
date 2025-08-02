import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

    return product && (
        <div 
            onClick={() => {
                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0);
            }} 
            className="w-64 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 cursor-pointer flex flex-col"
        >
            {/* Image Container - Fixed Height */}
            <div className="h-48 flex items-center justify-center p-4 bg-gray-50">
                <img 
                    className="max-h-full max-w-full object-contain transition-transform hover:scale-105" 
                    src={product.image[0]} 
                    alt={product.name} 
                />
            </div>

            {/* Product Info - Fixed Height */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Category */}
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {product.category}
                </span>
                
                {/* Product Name - Fixed height with clamp */}
                <h3 className="text-gray-800 font-medium text-lg line-clamp-2 h-14 mb-2">
                    {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    {Array(5).fill('').map((_, i) => (
                        <img 
                            key={i} 
                            className="w-4" 
                            src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                            alt=""
                        />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(4)</span>
                </div>
                
                {/* Price and Add to Cart */}
                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <p className="text-xl font-semibold text-primary">
                            {currency}{product.offerPrice}
                        </p>
                        {product.offerPrice < product.price && (
                            <p className="text-xs text-gray-400 line-through">
                                {currency}{product.price}
                            </p>
                        )}
                    </div>
                    
                    <div onClick={(e) => e.stopPropagation()}>
                        {!cartItems[product._id] ? (
                            <button 
                                className="flex items-center justify-center gap-1 bg-primary/10 hover:bg-primary/20 border border-primary/40 px-3 py-1.5 rounded-full text-sm font-medium text-primary transition-colors"
                                onClick={() => addToCart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart" className="w-4" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-between gap-2 w-24 h-9 bg-primary/10 rounded-full px-2">
                                <button 
                                    onClick={() => removeFromCart(product._id)}
                                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-sm font-medium">{cartItems[product._id]}</span>
                                <button 
                                    onClick={() => addToCart(product._id)}
                                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;