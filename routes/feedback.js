import express from 'express';
import * as feedback from '../controllers/feedback.js';
import authorise from '../middleware/userMiddelware.js';

export const feedbackRouter = express.Router()
export const createfeedbackSubmitRouter = express.Router()


feedbackRouter.get('/feedback-page/:productId', authorise(['user']), feedback.feedback);
createfeedbackSubmitRouter.post('/create-feedback-submit', authorise(['user']), feedback.createFeedbackSubmit);
