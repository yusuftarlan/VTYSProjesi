import express from 'express';
import * as Controller from '../db/controllers/Controller.js';

const router = express.Router();

router.post('/orders', Controller.createOrder);
router.get('/requests/my-requests', Controller.getCustomerRequests);
router.put('/requests/:id/status', Controller.updateRequestStatus);
router.post('/requests/:id/rate', Controller.rateTechnician);
router.post('/requests/:id/message', Controller.sendMessage);
router.get('/complaints/my-complaints', Controller.getCustomerComplaints);
router.post('/complaints', Controller.createComplaint);
router.get('/types', Controller.getProductTypes);
router.get('/brands', Controller.getBrands);

router.get('/admin/complaints', Controller.getAllComplaintsForAdmin);         
router.put('/admin/complaints/:id/resolve', Controller.resolveComplaint);      
router.get('/admin/technicians-stats', Controller.getTechniciansWithStats);
router.get('/requests/technician-jobs', Controller.getTechnicianRequests); 
router.put('/technicians/availability', Controller.toggleAvailability);
router.put('/delete/tech', Controller.deleteTechnician);
router.put('/requests/status', Controller.updateRequestStatus);

export default router;