import express from 'express';
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import { authUser } from '../middleware/authMiddleware.js'; 

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authUser, getUserProfile); 
userRouter.get('/logout', authUser, logoutUser); 

export default userRouter;
