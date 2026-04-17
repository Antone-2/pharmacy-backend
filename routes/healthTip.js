import { Router } from 'express';
import { getHealthTips, createHealthTip, updateHealthTip, deleteHealthTip } from '../controllers/healthTipController.js';

const router = Router();

router.get('/', getHealthTips);
router.post('/', createHealthTip);
router.put('/:id', updateHealthTip);
router.delete('/:id', deleteHealthTip);

export default router;