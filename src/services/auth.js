import bcrypt from 'bcrypt';
import createError from 'http-errors';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import Session from '../models/session.js';

export const registerNewUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  return user.save();
};

const generateToken = (user, expiresIn) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
};

export const createSession = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, 'Invalid email or password');
  }

  await Session.deleteMany({ userId: user._id });
  const accessToken = generateToken(user, '15m');
  const refreshToken = generateToken(user, '30d');

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  await session.save();
  return session;
};

export const refreshUserSession = async ({ refreshToken }) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch {
    throw createError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({ userId: payload.id, refreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createError(401, 'Refresh token expired');
  }

  await Session.deleteMany({ userId: payload.id });

  const user = await User.findById(payload.id);
  const newAccessToken = generateToken(user, '15m');
  const newRefreshToken = generateToken(user, '30d');

  const newSession = new Session({
    userId: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  await newSession.save();
  return newSession;
};

export const deleteSession = async ({ refreshToken }) => {
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createError(401, 'Invalid refresh token');
  }
};
