import Contact from '../models/contact.js';

export const createNewContact = async (contactData) => {
  return Contact.create(contactData);
};

export const updateContact = async (id, updateData, userId) => {
  const updateContact = await Contact.findByIdAndUpdate(
    { _id: id, userId },
    updateData,
    { new: true },
  );
  return updateContact;
};

export const deleteContact = async (id, userId) => {
  const contact = await Contact.findByIdAndDelete({ _id: id, userId });
  return contact;
};
