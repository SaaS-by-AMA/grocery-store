import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderEmail } from "../utils/SendOrderEmail.js";


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

    // Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

 

    // Build detailed product list with price and quantity
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

    // Calculate tax
    const tax = Math.round(subtotal * TAX_RATE);

    // Apply delivery charge (free if above threshold)
    const delivery_ch =
      subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;

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


    // Format createdAt to Pakistan time
    const orderDate = formatPakistanTime(newOrder.createdAt);


    await sendOrderEmail({
      to: process.env.EMAIL_USER,
      subject: "New Order Placed on Al-Ghani Mart",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Order Received</h2>
      
      <h3 style="color: #4a5568; margin-top: 20px;">Order Details</h3>
      <p><strong>Order ID:</strong> ${newOrder._id}</p>
      <p><strong>Order Date:</strong> ${orderDate}</p>


      <p><strong>Payment Type:</strong> Cash on Delivery</p>
      <p><strong>Status:</strong> ${newOrder.status}</p>
      
      <h3 style="color: #4a5568; margin-top: 20px;">Customer Information</h3>
      <p><strong>Name:</strong> ${address.firstName} ${address.lastName}</p>
      <p><strong>Phone:</strong> ${address.phone}</p>
      <p><strong>Address:</strong> ${address.street}, ${address.town}</p>
      
      <h3 style="color: #4a5568; margin-top: 20px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f7fafc; text-align: left;">
            <th style="padding: 8px; border: 1px solid #e2e8f0;">Item</th>
            <th style="padding: 8px; border: 1px solid #e2e8f0;">Qty</th>
            <th style="padding: 8px; border: 1px solid #e2e8f0;">Price</th>
            <th style="padding: 8px; border: 1px solid #e2e8f0;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${detailedItems
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${item.name}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${item.quantity}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">Rs. ${item.price}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">Rs. ${item.total}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      
      <div style="margin-top: 20px; padding-top: 10px; border-top: 2px solid #e2e8f0;">
        <p style="text-align: right;"><strong>Subtotal:</strong> Rs. ${subtotal}</p>
        <p style="text-align: right;"><strong>Delivery:</strong> Rs. ${delivery_ch}</p>
        <p style="text-align: right; font-size: 1.2em; font-weight: bold;">Total Amount: Rs. ${totalAmount}</p>
      </div>

    </div>
  `,
    });

    return res.json({
      success: true,
      message: "Order Placed Successfully",
      orderId: newOrder._id,
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
