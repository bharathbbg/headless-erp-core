import { Request, Response, NextFunction } from 'express';
import { createProductSchema, updateStockSchema } from '../schemas/inventorySchema.js';
import Product from '../models/Product.js';

export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sku } = req.params;
        const validatedData = updateStockSchema.parse(req.body);

        const product = await Product.findOneAndUpdate(
            { sku },
            { currentStock: validatedData.currentStock },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                data: null,
                error: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = createProductSchema.parse(req.body);
        const product = new Product(validatedData);
        await product.save();
        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};
