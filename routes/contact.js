import { Router } from 'express';
import { createContact, getContacts, deleteContact } from '../controllers/contactController.js';

const router = Router();

router.post('/', createContact);
router.get('/', getContacts);
router.delete('/:id', deleteContact);

export default router;