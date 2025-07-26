import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createItem, deleteItem, listItems } from '../controllers/marketplace.controller';

const router = Router();

router.get('/', listItems);
router.post('/', authenticate, createItem);
router.delete('/:id', authenticate, deleteItem);

export default router;
