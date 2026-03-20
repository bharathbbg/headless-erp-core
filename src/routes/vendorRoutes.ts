import { Router } from 'express';
import { getQuotesBySku, createQuote } from '../controllers/vendorController.js';

const router = Router();

router.get('/quotes/:sku', getQuotesBySku);
router.post('/quotes', createQuote);

export default router;
