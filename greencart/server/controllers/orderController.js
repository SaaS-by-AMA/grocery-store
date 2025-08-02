import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        
        if (!address || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Items and address are required" 
            });
        }

        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product ${item.product} not found`);
            }
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        const newOrder = await Order.create({
            items,
            amount,
            address,
            paymentType: "COD",
            isPaid: false,
            status: 'Order Placed'
        });

        return res.json({ 
            success: true, 
            message: "Order Placed Successfully",
            orderId: newOrder._id 
        });
    } catch (error) {
        console.error("Order error:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate("items.product");
        
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }
        
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Add these new controller methods
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate("items.product");

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order: updatedOrder
        });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus } = req.body;

        const validStatuses = ['Pending', 'Verified', 'Failed'];
        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment status value'
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                paymentStatus,
                isPaid: paymentStatus === 'Verified' 
            },
            { new: true }
        ).populate("items.product");

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order: updatedOrder
        });
    } catch (error) {
        console.error("Update payment status error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("items.product")
            .sort({ 
                isPaid: 1,          // Unpaid orders first
                paymentStatus: 1,   // Pending payments first
                status: 1,          // New orders first
                createdAt: -1       // Recent orders first
            });
        
        res.json({ 
            success: true, 
            orders 
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch orders" 
        });
    }
}