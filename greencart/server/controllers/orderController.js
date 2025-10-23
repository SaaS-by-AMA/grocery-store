import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { queueOrderEmail } from "../utils/EmailQueue.js";


// Pakistan Time Formatter
function formatPakistanTime(date) {
  return new Intl.DateTimeFormat('en-PK', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
}

export const TAX_RATE = 0; 
export const DELIVERY_CHARGE = 50; 
export const MIN_ORDER_AMOUNT = 700;  
export const FREE_DELIVERY_THRESHOLD = 1000;


export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!address || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items and address are required",
      });
    }

    // Calculate amounts (your existing logic)
    let subtotal = 0;
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        const price = product.offerPrice;
        const total = price * item.quantity;
        subtotal += total;
        return {
          name: product.name,
          quantity: item.quantity,
          price,
          total,
        };
      })
    );

    // Check minimum order amount
    if (subtotal < MIN_ORDER_AMOUNT) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is Rs. ${MIN_ORDER_AMOUNT}`,
      });
    }

    const tax = Math.round(subtotal * TAX_RATE);
    const delivery_ch = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const totalAmount = subtotal + delivery_ch + tax;

    // Create order
    const newOrder = await Order.create({
      items,
      amount: totalAmount,
      address,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
    });

    const orderDate = formatPakistanTime(newOrder.createdAt);

    // IMMEDIATE RESPONSE - Don't wait for email
    res.json({
      success: true,
      message: "Order Placed Successfully",
      orderId: newOrder._id,
    });

    //  ASYNC EMAIL PROCESSING (happens after response)
    queueOrderEmail({
      orderId: newOrder._id,
      orderDate,
      address,
      detailedItems,
      subtotal,
      delivery_ch,
      tax,
      totalAmount,
      status: newOrder.status
    }).catch(error => {
      console.error("Email queuing failed:", error);
    });

  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add these new controller methods
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
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
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ["Pending", "Verified", "Failed"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status value",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus,
        isPaid: paymentStatus === "Verified",
      },
      { new: true }
    ).populate("items.product");

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product").sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
