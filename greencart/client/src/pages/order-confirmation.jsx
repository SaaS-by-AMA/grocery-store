import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { currency, axios } = useAppContext();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await axios.get(`/api/order/${orderId}`);
        if (data.success) {
          setOrder(data.order);
        } else {
          toast.error(data.message);
          navigate('/');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load order details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, axios, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-20 h-20 mb-4 flex items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-medium mb-2">Order Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Calculate tax and total
  const tax = order.amount * 0.02;
  const total = order.amount + tax;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        {/* Order Confirmation Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
          <p className="text-sm text-gray-500 mt-2">Order ID: {order._id}</p>
        </div>

        {/* Order Summary */}
        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {item.product?.image ? (
                      <img 
                        src={item.product.image[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="w-6 h-6 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.product?.name || 'Product'}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">
                  {currency}{(item.product?.offerPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{currency}{order.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (2%)</span>
              <span>{currency}{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>{currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Shipping Information</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
            <p className="text-gray-600">{order.address.street}</p>
            <p className="text-gray-600">{order.address.town}</p>
            <p className="text-gray-600">{order.address.phone}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Payment Information</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="capitalize">
              <span className="font-medium">Method:</span> {order.paymentType}
            </p>
            <p>
              <span className="font-medium">Status:</span> {order.isPaid ? 'Paid' : 'Pending'}
            </p>
            <p>
              <span className="font-medium">Order Status:</span> {order.status}
            </p>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dull transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;