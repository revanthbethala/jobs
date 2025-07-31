import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';
import {
  uploadRoundResults, 
  getUserRoundResults,
  getJobRoundSummary,
  getSpecificRoundResults,
  deleteRound,
  bulkDeleteUsersFromRound,
} from '../controllers/roundController';

const router = express.Router();

const asyncHandler =
  (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/upload', protect, isAdmin, asyncHandler(uploadRoundResults));
router.get('/user', protect, getUserRoundResults);
router.get('/job/:jobId', protect, isAdmin, getJobRoundSummary);
router.get('/results/:jobId/:roundName', protect, asyncHandler(getSpecificRoundResults));
router.delete('/:roundId',protect,isAdmin,asyncHandler(deleteRound))
router.delete('/results/:jobId/:roundName/users', asyncHandler(bulkDeleteUsersFromRound));
export default router;