import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { createItem, deleteItem, listItems, addInterest, getInterests, acceptInterest } from '../controllers/marketplace.controller';

const router = Router();

router.get('/', listItems);
router.post('/', authenticate, upload.single('image'), createItem);
router.post('/:id/interested', authenticate, addInterest);
router.get('/:id/interests', authenticate, getInterests);
router.post('/:id/interests/:interestId/accept', authenticate, acceptInterest);
router.delete('/:id', authenticate, deleteItem);

export default router;
