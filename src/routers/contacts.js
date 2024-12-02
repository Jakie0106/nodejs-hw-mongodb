import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { contactSchema } from '../validators/contactValidator.js';
import isValidId from '../middlewares/isValidId.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:id', isValidId, ctrlWrapper(getContactById));
router.post(
  '/',
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:id',
  isValidId,
  validateBody(contactSchema),
  ctrlWrapper(updateContactController),
);
router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
