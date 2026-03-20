import { Router } from 'express';
import { getInventory, updateStock, createProduct } from '../controllers/inventoryController.js';

const router = Router();

router.get('/', getInventory);
router.patch('/:sku', updateStock);
router.post('/', createProduct); // Adding create product for convenience

export default router;
