import { checkSchema } from 'express-validator';

export const createContactSchema = checkSchema({
  name: {
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: 'Name should be between 3 and 20 characters',
    },
    notEmpty: true,
    errorMessage: 'Name is required',
  },
  phoneNumber: {
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: 'Phone number should be between 3 and 20 characters',
    },
    notEmpty: true,
    errorMessage: 'Phone number is required',
  },
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Invalid email address',
  },
  isFavourite: {
    isBoolean: true,
    errorMessage: 'isFavourite should be a boolean value',
  },
  contactType: {
    isIn: {
      options: [['personal', 'business', 'work', 'home', 'emergency', 'other']],
      errorMessage: 'Invalid contact type',
    },
  },
});

export const updateContactSchema = checkSchema({
  name: {
    optional: true,
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: 'Name should be between 3 and 20 characters',
    },
  },
  phoneNumber: {
    optional: true,
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: 'Phone number should be between 3 and 20 characters',
    },
  },
  email: {
    optional: true,
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Invalid email address',
  },
  isFavourite: {
    optional: true,
    isBoolean: true,
    errorMessage: 'isFavourite should be a boolean value',
  },
  contactType: {
    optional: true,
    isIn: {
      options: [['personal', 'business', 'work', 'home', 'emergency', 'other']],
      errorMessage: 'Invalid contact type',
    },
  },
  photo: {
    optional: true,
    isString: true,
    errorMessage: 'Photo should be a string URL',
  },
});
