import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getPolls, createPoll, votePoll, deletePoll, addFeedback } from '../controllers/poll.controller.js';

const router = Router();

router.get('/', authenticate, getPolls);
router.post('/', authenticate, authorize(['admin']), createPoll);
router.post('/:id/vote', authenticate, votePoll);
router.post('/:id/feedback', authenticate, addFeedback);
router.delete('/:id', authenticate, deletePoll);

export default router;
