import express from 'express';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.post('/refresh', refreshSession);
router.post('/logout', logoutUser);
router.post(
  '/send-reset-email',
  validateBody(emailSchema),
  sendResetEmailController,
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

export default router;
