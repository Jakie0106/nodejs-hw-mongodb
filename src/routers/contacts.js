import express from 'express';
import { getAllContacts, getContactById } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:id', ctrlWrapper(getContactById));

export default router;
