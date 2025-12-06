import express from 'express';
import * as Controller from '../db/controllers/Controller.js';

const router = express.Router();

router.post('/orders', Controller.createOrder);
router.get('/requests/my-requests', Controller.getCustomerRequests);
router.put('/requests/:id/status', Controller.updateRequestStatus);
router.post('/requests/:id/rate', Controller.rateTechnician);
router.post('/requests/:id/message', Controller.sendMessage);
router.post('/complaints', Controller.createComplaint);


export default router;