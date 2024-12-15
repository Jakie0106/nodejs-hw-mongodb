import { checkSchema } from 'express-validator';

export const registerSchema = checkSchema({
  name: {
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: 'Name is required',
  },
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Invalid email',
  },
  password: {
    isLength: {
      options: { min: 6 },
    },
    errorMessage: 'Password must be at least 6 characters long',
  },
});

export const loginSchema = checkSchema({
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Invalid email',
  },
  password: {
    notEmpty: true,
    errorMessage: 'Password is required',
  },
});

export const emailSchema = checkSchema({
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Invalid email address',
  },
});
export const resetPasswordSchema = checkSchema({
  token: {
    in: ['body'],
    isString: true,
    errorMessage: 'Invalid token',
  },
  password: {
    in: ['body'],
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
  },
});
