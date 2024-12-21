import 'dotenv/config';
import * as fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerUi from 'swagger-ui-express';

const TMP_DIR = path.resolve('src', 'tmp');
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

export const setupServer = () => {
  const app = express();
  const logger = pino();
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8'),
  );

  app.use(cors());
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/contacts', contactsRouter);

  app.use('/auth', authRouter);

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
};
