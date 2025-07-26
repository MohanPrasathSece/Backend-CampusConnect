import { Router } from 'express';
import {
  deleteItem,
  getItems,
  reportItem,
  updateItem,
  addResponse,
  closeItem
} from '../controllers/lostfound.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { Role } from '../models/User.js';

const router = Router();

router.use(authenticate);
router.get('/', getItems);
router.post('/', upload.single('image'), reportItem);
router.put('/:id', authorize([Role.Admin]), updateItem);
router.post('/:id/respond', upload.single('image'), addResponse);
router.put('/:id/close', closeItem);
router.delete('/:id', authorize([Role.Admin]), deleteItem);

export default router;
