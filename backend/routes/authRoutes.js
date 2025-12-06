import express from 'express';
import { registerUser, loginUser, logoutUser, checkUserName, requestVerification, verifyOtp, getCurrentUser} from '../controllers/authController.js';
import { validate } from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { registerSchema, loginSchema, checkUserNameSchema, verifyOtpSchema } from '../validations/authSchema.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/check-username', validate(checkUserNameSchema), checkUserName);
router.get('/me', authenticate, getCurrentUser);
router.post('/request-verification', authenticate, requestVerification);
router.post('/verify-otp', authenticate, validate(verifyOtpSchema), verifyOtp);

export default router;