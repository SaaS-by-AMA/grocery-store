import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderEmail } from "../utils/SendOrderEmail.js";

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

    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    const newOrder = await Order.create({
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
    });

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

    //  Now calculate tax and total amount
    const tax = Math.round(subtotal * 0.02); // 2% tax
    const totalAmount = subtotal + tax;

    await sendOrderEmail({
      to: process.env.EMAIL_USER,
      subject: "New Order Placed on Al-Ghani Mart",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Order Received</h2>
      
      <h3 style="color: #4a5568; margin-top: 20px;">Order Details</h3>
      <p><strong>Order ID:</strong> ${newOrder._id}</p>
      <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
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
        <p style="text-align: right;"><strong>Tax (2%):</strong> Rs. ${tax}</p>
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
    const orders = await Order.find().populate("items.product").sort({
      isPaid: 1, // Unpaid orders first
      paymentStatus: 1, // Pending payments first
      status: 1, // New orders first
      createdAt: -1, // Recent orders first
    });

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
