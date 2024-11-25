import Contact from '../models/contact.js';

export const createNewContact = async (contactData) => {
  return Contact.create(contactData);
};

export const updateContact = async (id, updateData) => {
  const updateContact = await Contact.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return updateContact;
};
