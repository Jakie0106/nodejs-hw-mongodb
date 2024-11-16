import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import Contact from './models/contact.js';

export const setupServer = () => {
  const app = express();
  const logger = pino();

  app.use(cors());

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.send({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 500, message: 'Internal server error' });
    }
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const contact = await Contact.findById(id);

      if (contact === null) {
        return res
          .status(404)
          .send({ status: 404, message: 'Contact not found' });
      }

      res.send({ status: 200, data: contact });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: 500, message: 'Internal server error' });
    }
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
