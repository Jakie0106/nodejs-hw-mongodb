import Contact from '../models/contact.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: 'Internal server error' });
  }
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res
        .status(404)
        .send({ status: 404, message: 'Contact not found' });
    }
    res.status(200).send({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: 'Internal server error' });
  }
};
