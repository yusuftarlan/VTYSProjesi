import express from 'express';
import * as authController from '../db/controllers/authController.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/register
router.post('/register', authController.register);

// GET /api/auth/me
router.get('/me', authController.getMe);

// POST /api/auth/logout
router.post('/logout', authController.logout);

router.get('/technicians', authController.getTechnicians);


router.get('/technicians/professions', authController.getProfessions);

export default router;