import express from 'express'
import { getCaptainProfile, loginCaptain, logoutCaptain, registerCaptain } from '../controllers/captainController.js';
import { authCaptain } from '../middleware/authMiddleware.js';

const captainRouter = express.Router()

captainRouter.post('/register', registerCaptain)
captainRouter.post('/login', loginCaptain)
captainRouter.get('/profile', authCaptain, getCaptainProfile)
captainRouter.get('/logout', authCaptain, logoutCaptain);

export default captainRouter;