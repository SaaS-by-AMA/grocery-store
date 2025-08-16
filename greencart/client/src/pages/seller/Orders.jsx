import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD,
  TAX_RATE,
} from '../../context/AppContext';

const Orders = () => {
    const { currency, axios } = useAppContext();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { data } = await axios.get('/api/order/seller/orders', {
                withCredentials: true
            });

            if (data.success) {
                setOrders(data.orders || []);
            } else {
                throw new Error(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
            setError(error.response?.data?.message || error.message);
            
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId);
            const { data } = await axios.patch(
                `/api/order/seller/orders/${orderId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );

            if (data.success) {
                setOrders(orders.map(order => 
                    order._id === orderId ? data.order : order
                ));
                toast.success(`Order status updated to ${newStatus}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const updatePaymentStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId);
            const { data } = await axios.patch(
                `/api/order/seller/orders/${orderId}/payment-status`,
                { paymentStatus: newStatus },
                { withCredentials: true }
            );

            if (data.success) {
                setOrders(orders.map(order => 
                    order._id === orderId ? data.order : order
                ));
                toast.success(`Payment status updated to ${newStatus}`);
                fetchOrders(); // Refresh to re-sort orders
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update payment status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // helper: compute subtotal, tax, delivery and computed total for an order
    const computeOrderAmounts = (order) => {
      const subtotal = (order.items || []).reduce((acc, item) => {
        // prefer product price, then item.price, else 0
        const unitPrice = (item.product && item.product.offerPrice) ?? item.price ?? 0;
        const qty = item.quantity ?? 0;
        return acc + unitPrice * qty;
      }, 0);

      const tax = subtotal * (TAX_RATE ?? 0);
      const deliveryCharge = subtotal >= (FREE_DELIVERY_THRESHOLD ?? Infinity) ? 0 : (DELIVERY_CHARGE ?? 0);
      const computedTotal = subtotal + tax + deliveryCharge;

      return { subtotal, tax, deliveryCharge, computedTotal };
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Order Placed': 'bg-blue-100 text-blue-800',
            'Processing': 'bg-yellow-100 text-yellow-800',
            'Shipped': 'bg-purple-100 text-purple-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800'
        };
        
        return (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const getPaymentBadge = (isPaid, paymentStatus) => {
        if (isPaid) return 'bg-green-100 text-green-800';
        if (paymentStatus === 'Pending') return 'bg-yellow-100 text-yellow-800';
        if (paymentStatus === 'Failed') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    const handleOrderClick = (orderId) => {
        navigate(`/order-details/${orderId}`);
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <img 
                    src={assets.error_icon} 
                    alt="Error" 
                    className="w-20 h-20 mb-4 opacity-70"
                />
                <p className="text-lg font-medium text-gray-700 mb-2">
                    {error.includes("401") ? "Session Expired" : "Error Loading Orders"}
                </p>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={fetchOrders}
                    className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
                >
                    Retry
                </button>
            </div>
        );
    }


    // format helper
    const fmt = (n) => `${currency}.${Number.isFinite(n) ? n.toFixed(2) : '0.00'}`;


    return (
        <div className="flex-1 h-[95vh] overflow-y-auto ">
            <div className="md:p-8 p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                    <button 
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Orders'}
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <img 
                            src={assets.empty_orders} 
                            alt="No orders" 
                            className="mx-auto h-40 w-40 opacity-70"
                        />
                        <p className="mt-4 text-gray-500">No orders found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const { subtotal, tax, deliveryCharge, computedTotal } = computeOrderAmounts(order);
                            const freeDelivery = deliveryCharge === 0;

                            return (
                            <div 
                                key={order._id} 
                                className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-4 md:p-5">
                                    {/* header row */}
                                    <div className="flex items-start md:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <h3 
                                                className="font-medium text-gray-900 hover:text-primary cursor-pointer truncate"
                                                onClick={() => handleOrderClick(order._id)}
                                            >
                                                Order #{order._id.substring(0, 8).toUpperCase()}
                                            </h3>
                                            {getStatusBadge(order.status)}
                                            {freeDelivery && (
                                              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-800">
                                                Free Delivery
                                              </span>
                                            )}
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                            <div className="text-lg font-semibold mt-1">{fmt(computedTotal)}</div>
                                        </div>
                                    </div>

                                    {/* compact 3-column grid (items | customer+payment | status+amounts) */}
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* ITEMS (scrollable) */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                                            <ul className="space-y-2 max-h-36 overflow-y-auto pr-2">
                                                {order.items.map((item, idx) => {
                                                    const displayPrice = (item.product && item.product.offerPrice) ?? item.price ?? 0;
                                                    return (
                                                    <li key={idx} className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                                {item.product?.image ? (
                                                                    <img 
                                                                        src={item.product.image[0]} 
                                                                        alt={item.product.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <img 
                                                                        src={assets.box_icon} 
                                                                        alt="Product"
                                                                        className="w-6 h-6 opacity-50"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium truncate">{item.product?.name || 'Product'}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <div className="ml-2 text-sm font-medium">
                                                            {fmt(displayPrice * (item.quantity ?? 0))}
                                                        </div>
                                                    </li>
                                                )})}
                                            </ul>
                                        </div>

                                        {/* CUSTOMER + PAYMENT */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Customer</h4>
                                            <div className="text-sm text-gray-700 space-y-1">
                                                <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                                                <p className="text-gray-600">{order.address.phone}</p>
                                                <p className="text-gray-600">{order.address.street}</p>
                                                <p className="text-gray-600">{order.address.town}</p>
                                            </div>

                                            <div className="mt-3">
                                                <h5 className="text-sm font-medium text-gray-500 mb-1">Payment</h5>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm capitalize">{order.paymentType}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentBadge(order.isPaid, order.paymentStatus)}`}>
                                                        {order.isPaid ? 'Verified' : order.paymentStatus}
                                                    </span>
                                                </div>

                                                {order.paymentType === 'COD' && !order.isPaid && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => updatePaymentStatus(order._id, 'Verified')}
                                                            disabled={updatingOrderId === order._id}
                                                            className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                                                        >
                                                            {updatingOrderId === order._id ? 'Updating...' : 'Mark as Paid'}
                                                        </button>
                                                        <button
                                                            onClick={() => updatePaymentStatus(order._id, 'Failed')}
                                                            disabled={updatingOrderId === order._id}
                                                            className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                                                        >
                                                            {updatingOrderId === order._id ? 'Updating...' : 'Mark as Failed'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* STATUS + AMOUNTS + ACTIONS */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Status & Summary</h4>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => updateOrderStatus(order._id, status)}
                                                        disabled={updatingOrderId === order._id || order.status === status}
                                                        className={`text-xs px-2 py-1 rounded ${order.status === status ? 'bg-blue-100 text-blue-800 cursor-default' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} ${updatingOrderId === order._id ? 'opacity-50' : ''}`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="text-sm text-gray-600 space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Subtotal</span>
                                                    <span>{fmt(subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Tax ({(TAX_RATE*100).toFixed(0)}%)</span>
                                                    <span>{fmt(tax)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Delivery</span>
                                                    <span className={`${freeDelivery ? 'text-green-700 font-medium' : ''}`}>
                                                        {freeDelivery ? 'Free' : fmt(deliveryCharge)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-semibold">
                                                    <span>Total</span>
                                                    <span>{fmt(computedTotal)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
