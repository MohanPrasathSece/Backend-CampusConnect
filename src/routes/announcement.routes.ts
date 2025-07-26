import { Router } from 'express';
import multer from 'multer';
import { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement, likeAnnouncement, viewAnnouncement } from '../controllers/announcement.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { Role } from '../models/User.js';

const router = Router();

// multer config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Public route - anyone can view announcements
router.get('/', getAnnouncements);
router.post('/:id/like', likeAnnouncement);
router.post('/:id/view', viewAnnouncement);

// Authenticated routes
router.use(authenticate);
router.post('/', authorize([Role.Admin]), upload.single('image'), createAnnouncement);
router.put('/:id', authorize([Role.Admin]), updateAnnouncement);
router.delete('/:id', authorize([Role.Admin]), deleteAnnouncement);

export default router;
