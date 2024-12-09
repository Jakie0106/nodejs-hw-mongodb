import Contact from '../models/contact.js';

export const createNewContact = async (contactData) => {
  return Contact.create(contactData);
};

export const getContactById = async (id, userId) => {
  return Contact.findOne({ _id: id, userId });
};

export const updateContact = async (id, updateData, userId) => {
  const updateContact = await Contact.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    { new: true },
  );
  return updateContact;
};

export const deleteContact = async (id, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: id, userId });
  return contact;
};
