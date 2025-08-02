import React, { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
    const { products, searchQuery } = useAppContext();
    
    // Use useMemo for better performance with filtered products
    const filteredProducts = useMemo(() => {
        if (searchQuery.length > 0) {
            return products.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return products;
    }, [products, searchQuery]);

    // Filter out-of-stock products
    const inStockProducts = useMemo(() => 
        filteredProducts.filter(product => product.inStock), 
        [filteredProducts]
    );

    return (
        <div className='mt-16 flex flex-col px-4'>
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium uppercase'>All products</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            {inStockProducts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                    {inStockProducts.map((product, index) => (
                        <ProductCard key={`${product._id}-${index}`} product={product}/>
                    ))}
                </div>
            ) : (
                <div className='mt-8 text-center text-gray-500'>
                    {searchQuery.length > 0 
                        ? 'No matching products found' 
                        : 'No products available at the moment'}
                </div>
            )}
        </div>
    );
};

export default AllProducts;