import { Request, Response, NextFunction } from 'express';
import { createPurchaseOrderSchema, updateStatusSchema } from '../schemas/procurementSchema.js';
import PurchaseOrder, { PurchaseOrderStatus } from '../models/PurchaseOrder.js';

export const requestPurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = createPurchaseOrderSchema.parse(req.body);
        const purchaseOrder = new PurchaseOrder(validatedData);
        await purchaseOrder.save();
        res.status(201).json({
            success: true,
            data: purchaseOrder,
        });
    } catch (error) {
        next(error);
    }
};

export const getPendingPurchaseOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pendingOrders = await PurchaseOrder.find({
            status: PurchaseOrderStatus.PENDING_APPROVAL,
        });
        res.status(200).json({
            success: true,
            data: pendingOrders,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePurchaseOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const validatedData = updateStatusSchema.parse(req.body);

        const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
            id,
            { status: validatedData.status },
            { new: true, runValidators: true }
        );

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                data: null,
                error: 'Purchase order not found',
            });
        }

        res.status(200).json({
            success: true,
            data: purchaseOrder,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPurchaseOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allOrders = await PurchaseOrder.find();
        res.status(200).json({
            success: true,
            data: allOrders,
        });
    } catch (error) {
        next(error);
    }
};
