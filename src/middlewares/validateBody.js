import { validationResult } from 'express-validator';

const validateBody = (schema) => {
  return async (req, res, next) => {
    await schema.run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

export default validateBody;
