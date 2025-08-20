// SendOrderEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendOrderEmail(order) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


  const mailOptions = {
    from: `"Alghani Mart" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: order.subject || "New Order Received",
    html: order.html || `A new order has been placed:\n\n\nAddress: ${order.address}\nTotal: ₹${order.amount}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}
