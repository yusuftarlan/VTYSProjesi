import express from 'express';
import * as Controller from '../db/controllers/Controller.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', Controller.login);

// POST /api/auth/register
router.post('/register', Controller.register);

// GET /api/auth/me
router.get('/me', Controller.getMe);

// POST /api/auth/logout
router.post('/logout', Controller.logout);

router.get('/technicians', Controller.getTechnicians);


router.get('/technicians/professions', Controller.getProfessions);


export default router;