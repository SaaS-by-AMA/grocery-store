import express from 'express';
import { 
    placeOrderCOD, 
    getOrderById, 
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus
} from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

// Protected seller routes
orderRouter.get('/seller/orders', authSeller, getAllOrders);
orderRouter.patch('/seller/orders/:orderId/status', authSeller, updateOrderStatus);
orderRouter.patch('/seller/orders/:orderId/payment-status', authSeller, updatePaymentStatus);

// Guest checkout
orderRouter.post('/cod', placeOrderCOD);

// Get order by ID
orderRouter.get('/:id', getOrderById);

export default orderRouter;