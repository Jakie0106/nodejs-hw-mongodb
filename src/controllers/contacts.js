import Contact from '../models/contact.js';
import createHttpError from 'http-errors';
import {
  createNewContact,
  deleteContact,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { upload, uploadToCloudinary } from '../services/cloudinary.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    };

    const contacts = await Contact.paginate({ userId: req.user._id }, options);
    res.status(200).send({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts.docs,
        page: contacts.page,
        perPage: contacts.limit,
        totalItems: contacts.totalDocs,
        totalPages: contacts.totalPages,
        hasPreviousPage: contacts.hasPrevPage,
        hasNextPage: contacts.hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id, req.user._id);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).send({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      return next(createHttpError(500, 'Failed to upload photo'));
    }
    try {
      const { name, phoneNumber, email, isFavourite, contactType } = req.body;
      console.log('Request body:', req.body);
      console.log('File info:', req.file);

      let photo = null;

      if (req.file) {
        photo = await uploadToCloudinary(req.file.buffer);
      }
      const newContact = await createNewContact({
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
        photo,
        userId: req.user._id,
      });

      await newContact.save();

      res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
      });
    } catch (error) {
      next(error);
    }
  });
};

export const updateContactController = async (req, res, next) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      return next(createHttpError(500, 'Failed to upload photo'));
    }
    const { id } = req.params;
    try {
      const updateData = req.body;
      if (req.file) {
        updateData.photo = await uploadToCloudinary(req.file.buffer);
      }
      const updatedContact = await updateContact(id, updateData, req.user._id);
      if (!updatedContact) {
        throw createHttpError(404, 'Contact not found');
      }
      res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updatedContact,
      });
    } catch (error) {
      next(error);
    }
  });
};

export const deleteContactController = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await deleteContact(id, req.user._id);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
