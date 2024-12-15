import express from 'express';
import {
  getAllContacts,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validators/contactValidator.js';
import { upload } from '../services/cloudinary.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:id',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);
router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
