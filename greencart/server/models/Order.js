import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    items: [{
        product: { type: String, required: true, ref: 'product' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        town: { type: String, required: true },
        paymentMethod: { type: String, required: true }
    },
    status: { 
        type: String, 
        enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Order Placed' 
    },
    paymentType: { type: String, required: true },
    isPaid: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Failed'],
        default: 'Pending'
    }
}, { 
    timestamps: true
});

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

// Function to ensure TTL index exists
async function ensureTTLIndex() {
    try {
        await Order.collection.createIndex(
            { "createdAt": 1 }, 
            { 
                name: "order_expiration_ttl",
                expireAfterSeconds: 6000 // 30 days
            }
        );
        console.log('TTL index created or verified');
    } catch (error) {
        console.error('Error creating TTL index:', error);
    }
}

// Export both the model and the ensure function
export { Order, ensureTTLIndex };
export default Order;