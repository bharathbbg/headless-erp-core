import { Router } from 'express';
import {
    requestPurchaseOrder,
    getPendingPurchaseOrders,
    updatePurchaseOrderStatus,
    getAllPurchaseOrders
} from '../controllers/procurementController.js';

const router = Router();

router.post('/request', requestPurchaseOrder);
router.get('/pending', getPendingPurchaseOrders);
router.patch('/:id/status', updatePurchaseOrderStatus);
router.get('/', getAllPurchaseOrders);

export default router;
