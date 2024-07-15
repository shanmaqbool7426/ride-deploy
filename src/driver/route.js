import express from 'express';
import driverController from './controller.js';
import FeedbackRatingController from '../feedback-rating/controller.js';
// import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', driverController.registerDriver);

router.post('/login', driverController.loginDriver);

router.get('/profile', driverController.getDriverProfile);

router.put('/profile', driverController.updateDriverProfile);
router.get('/:driverId', FeedbackRatingController.getRideDetails);
router.get('/transections/:ownerId', driverController.transectionHistory);

export default router;
