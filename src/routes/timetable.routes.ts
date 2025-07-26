import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getTimetable, upsertTimetable } from '../controllers/timetable.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getTimetable);
router.post('/', upsertTimetable);

export default router;
