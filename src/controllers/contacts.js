import 'dotenv/config';
import * as fs from 'node:fs/promises';
import Contact from '../models/contact.js';
import createHttpError from 'http-errors';
import {
  createNewContact,
  deleteContact,
  getContactById,
  updateContact,
} from '../services/contacts.js';

import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import path from 'node:path';
// import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

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
  try {
    let photo = null;

    console.log('File info:', req.file);

    if (typeof req.file !== 'undefined') {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
        console.log('Uploaded to Cloudinary:', photo);
      } else {
        await fs.rename(
          req.file.path,
          path.resolve('src', 'uploads', req.file.filename),
        );
        photo = `http://localhost:3000/photo/${req.file.filename}`;
        console.log('Stored locally:', photo);
      }
    }

    const newContact = await createNewContact({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      isFavourite: req.body.isFavourite,
      contactType: req.body.contactType,
      userId: req.user._id,
      photo,
    });

    await newContact.save();

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  try {
    let photo = null;
    const updateData = req.body;
    if (typeof req.file !== 'undefined') {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
      } else {
        await fs.rename(
          req.file.path,
          path.resolve('src', 'public', 'photo', req.file.filename),
        );
        photo = `http://localhost:3000/photo/${req.file.filename}`;
      }
      updateData.photo = photo;
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
