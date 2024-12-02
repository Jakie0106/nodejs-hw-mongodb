import { checkSchema } from 'express-validator';

export const contactSchema = checkSchema({
  name: {
    isString: true,
    trim: true,
    isLength: {
      options: { min: 3, max: 20 },
    },
    errorMessage: 'Name should be between 3 and 20 characters',
  },
  phoneNumber: {
    isString: true,
    trim: true,
    isLength: {
      options: { min: 3, max: 20 },
    },
    errorMessage: 'Phone number should be between 3 and 20 characters',
  },
  email: {
    optional: true,
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Invalid email',
  },
  isFavourite: {
    optional: true,
    isBoolean: true,
    toBoolean: true,
    errorMessage: 'Invalid value for isFavourite',
  },
  contactType: {
    isString: true,
    trim: true,
    isIn: {
      options: [['work', 'home', 'personal']],
    },
    errorMessage: 'Invalid contact type',
  },
});
