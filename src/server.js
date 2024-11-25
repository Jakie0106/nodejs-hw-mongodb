import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactsRouter from './routers/contacts.js';

export const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());

  app.use('/contacts', contactsRouter);

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal server error' });
  });

  return app;
};
