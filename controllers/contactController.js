import Contact from '../models/Contact.js';
import { notifyAdmin, sendConfirmation } from '../services/emailService.js';
import { sanitizeObject, validateEmail, validatePhone } from '../utils/validation.js';

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    
    if (email && !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const sanitized = sanitizeObject({ name, email, phone, message });
    console.log('Creating contact:', { name: sanitized.name, phone: sanitized.phone });

    try {
      const contact = new Contact(sanitized);
      await contact.save();
      console.log('Contact saved:', contact._id);
    } catch (dbError) {
      console.log('MongoDB unavailable - saving emails only');
    }

    await notifyAdmin(sanitized).catch(err => console.error('Admin email error:', err));
    if (sanitized.email) {
      await sendConfirmation(sanitized.email, sanitized.name).catch(err => console.error('Confirmation email error:', err));
    }

    res.status(201).json({ message: 'Contact submitted successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};