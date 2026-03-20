import { Router } from 'express';
import { logToolCall, getSystemLogs } from '../controllers/auditController.js';

const router = Router();

router.post('/log', logToolCall);
router.get('/', getSystemLogs);

export default router;
