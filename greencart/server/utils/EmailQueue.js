import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();


const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory queue with retry logic
class EmailQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.maxRetries = 3;
  }

  async add(emailData) {
    this.queue.push({ ...emailData, retries: 0 });
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const emailData = this.queue[0];

    try {
      await this.sendEmail(emailData);
      console.log(`✅ Email sent successfully for order:${emailData.orderId} from ${emailData.address.firstName}` );
      this.queue.shift(); // Remove from queue on success
    } catch (error) {
      console.error(`❌ Email failed for order ${emailData.orderId}:`, error.message);
      
      emailData.retries += 1;
      
      if (emailData.retries >= this.maxRetries) {
        console.error(`🚨 Giving up on order ${emailData.orderId} after ${this.maxRetries} retries`);
        this.queue.shift(); // Remove after max retries
      } else {
        console.log(`🔄 Retrying order ${emailData.orderId} (${emailData.retries}/${this.maxRetries})`);
        // Move to end of queue for retry
        this.queue.push(this.queue.shift());
      }
    }

    // Wait before processing next email (avoid rate limits)
    setTimeout(() => this.processQueue(), 2000);
  }

  async sendEmail(emailData) {
    const { data, error } = await resend.emails.send({
      from: 'Alghani Mart <onboarding@resend.dev>',
      to: [process.env.SELLER_EMAIL_R],
      subject: `New Order #${emailData.orderId} - Alghani Mart`,
      html: this.generateEmailTemplate(emailData),
    });

    if (error) throw new Error(error.message);
    return data;
  }

  generateEmailTemplate(emailData) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Order Received</h2>
      
      <h3 style="color: #4a5568; margin-top: 20px;">Order Details</h3>
      <p><strong>Order ID:</strong> ${emailData.orderId}</p>
      <p><strong>Order Date:</strong> ${emailData.orderDate}</p>
      <p><strong>Payment Type:</strong> Cash on Delivery</p>
      <p><strong>Status:</strong> ${emailData.status}</p>
      
      <h3 style="color: #4a5568; margin-top: 20px;">Customer Information</h3>
      <p><strong>Name:</strong> ${emailData.address.firstName} ${emailData.address.lastName}</p>
      <p><strong>Phone:</strong> ${emailData.address.phone}</p>
      <p><strong>Address:</strong> ${emailData.address.street}, ${emailData.address.town}</p>
      
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
          ${emailData.detailedItems.map(item => `
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${item.name}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${item.quantity}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">Rs. ${item.price}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">Rs. ${item.total}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 20px; padding-top: 10px; border-top: 2px solid #e2e8f0;">
        <p style="text-align: right;"><strong>Subtotal:</strong> Rs. ${emailData.subtotal}</p>
        <p style="text-align: right;"><strong>Delivery:</strong> Rs. ${emailData.delivery_ch}</p>
        <p style="text-align: right;"><strong>Tax:</strong> Rs. ${emailData.tax}</p>
        <p style="text-align: right; font-size: 1.2em; font-weight: bold;">Total Amount: Rs. ${emailData.totalAmount}</p>
      </div>
    </div>
    `;
  }
}

// Singleton instance
export const emailQueue = new EmailQueue();

export const queueOrderEmail = (emailData) => {
  return emailQueue.add(emailData);
};