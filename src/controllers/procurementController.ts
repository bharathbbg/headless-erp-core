import { Request, Response, NextFunction } from 'express';
import { createPurchaseOrderSchema, updateStatusSchema } from '../schemas/procurementSchema.js';
import PurchaseOrder, { PurchaseOrderStatus } from '../models/PurchaseOrder.js';
import SystemLog from '../models/SystemLog.js';

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

        let purchaseOrder = await PurchaseOrder.findById(id);
        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                data: null,
                error: 'Purchase order not found',
            });
        }

        const targetStatus = validatedData.status;
        const agentName = validatedData.agentName || 'UNKNOWN';

        // Industrial Safety Rule: > 100,000 INR requires human 'Admin'
        if (targetStatus === PurchaseOrderStatus.APPROVED && purchaseOrder.totalAmount > 100000 && agentName !== 'Admin') {
            purchaseOrder.status = PurchaseOrderStatus.AWAITING_HUMAN_CONFIRMATION;
            await purchaseOrder.save();
            return res.status(403).json({
                success: false,
                data: purchaseOrder,
                error: 'Safety Limit Exceeded: Orders > 100,000 INR require manual approval by Admin (Human). Status set to AWAITING_HUMAN_CONFIRMATION.',
            });
        }

        purchaseOrder.status = targetStatus;
        await purchaseOrder.save();

        // Internal ERP Log for traceability
        const log = new SystemLog({
            agentName,
            toolName: 'erp_internal_status_update',
            arguments: { id, targetStatus },
            status: 'SUCCESS',
            response: purchaseOrder,
        });
        await log.save();

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
