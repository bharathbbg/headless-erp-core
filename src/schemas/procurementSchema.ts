import { z } from 'zod';
import { PurchaseOrderStatus } from '../models/PurchaseOrder.js';

export const createPurchaseOrderItemSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
    price: z.number().nonnegative('Price cannot be negative'),
});

export const createPurchaseOrderSchema = z.object({
    vendorId: z.string().min(1, 'Vendor ID is required'),
    items: z.array(createPurchaseOrderItemSchema).min(1, 'Must have at least one item'),
});

export const updateStatusSchema = z.object({
    status: z.nativeEnum(PurchaseOrderStatus, {
        errorMap: (issue, ctx) => ({ message: 'Invalid purchase order status' }),
    }),
    agentName: z.string().optional(),
});
