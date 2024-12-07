import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/user.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'No access token provided'));
  }

  const token = authHeader.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next(createError(401, 'Access token expired'));
  }

  const user = await User.findById(payload.id);
  if (!user) {
    return next(createError(401, 'User not found'));
  }

  req.user = user;
  next();
};

export default authenticate;
