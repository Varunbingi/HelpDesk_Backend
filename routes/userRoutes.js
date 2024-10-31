import express from 'express';
import { registerUser, loginUser, updateProfile, logoutUser } from '../controllers/userController.js';
import  authMiddleware  from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', authMiddleware, updateProfile);
router.post('/logout', authMiddleware, logoutUser); 

export default router;
