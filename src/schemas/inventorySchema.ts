import { z } from 'zod';

export const createProductSchema = z.object({
    sku: z.string().min(1, 'SKU is required'),
    name: z.string().min(1, 'Name is required'),
    currentStock: z.number().int().nonnegative('Stock cannot be negative').default(0),
    reorderLevel: z.number().int().nonnegative('Reorder level cannot be negative').default(0),
    unitPrice: z.number().nonnegative('Price cannot be negative').default(0),
    currency: z.string().optional().default('INR'),
});

export const updateStockSchema = z.object({
    currentStock: z.number().int().nonnegative('Stock cannot be negative'),
});
