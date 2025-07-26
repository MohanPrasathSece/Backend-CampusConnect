import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { getTechNews, createTechNews, deleteTechNews } from '../controllers/technews.controller.js';

const router = Router();

router.get('/', authenticate, getTechNews);
router.post('/', authenticate, upload.single('image'), createTechNews);
router.delete('/:id', authenticate, deleteTechNews);

export default router;
