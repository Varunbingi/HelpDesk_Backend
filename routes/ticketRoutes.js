import express from 'express';
import {
  createTicket,
  getAllTickets,
  addNoteToTicket,
  updateTicketStatus,
  getNotesForTicket,
  getStatus
} from '../controllers/ticketController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multerMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTicket);
router.get('/', authMiddleware, getAllTickets);
router.post('/:id/notes', authMiddleware,upload.single('attachments'), addNoteToTicket);
router.put('/:id/status', authMiddleware, updateTicketStatus);
router.get('/:id/notes',authMiddleware,getNotesForTicket);
router.get('/:id/status',authMiddleware,getStatus)


export default router;
