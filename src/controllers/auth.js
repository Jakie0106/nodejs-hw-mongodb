import 'dotenv/config';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  registerNewUser,
  createSession,
  refreshUserSession,
  deleteSession,
} from '../services/auth.js';
import { sendResetEmail } from '../services/emailService.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import UserSession from '../models/userSession.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerNewUser({ name, email, password });
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const session = await createSession({ email, password });
    res.cookie('refreshToken', session.refreshToken, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const session = await refreshUserSession({ refreshToken });
    res.cookie('refreshToken', session.refreshToken, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await deleteSession({ refreshToken });
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const sendResetEmailController = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });
    await sendResetEmail(email, user.name, token);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch {
    next(
      createHttpError(500, 'Failed to send the email, please try again later.'),
    );
  }
};

export const resetPasswordController = async (req, res, next) => {
  const { token, password } = req.body;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await UserSession.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch {
    next(createHttpError(401, 'Token is expired or invalid.'));
  }
};
