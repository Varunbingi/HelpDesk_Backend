import fs from 'fs/promises';
import cloudinary from 'cloudinary';
import Ticket from '../models/ticketModel.js';



export const createTicket = async (req, res) => {
  const { title, userId } = req.body;
  if (!title || !userId) {
    return res.status(400).json({ message: 'Title and userId are required' });
  }

  try {
    const ticket = new Ticket({ title, customerName: userId });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
};


export const getAllTickets = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === 'Admin' || req.user.role === 'Agent') {
      tickets = await Ticket.find().populate('customerName').sort({ lastUpdatedOn: -1 });
    } else if (req.user.role === 'Customer') {
      tickets = await Ticket.find({ customerName: req.user.id }) 
        .populate('customerName')
        .sort({ lastUpdatedOn: -1 });
    } else {
      return res.status(403).json({ message: 'Permission denied' });
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tickets', error: error.message });
  }
};


export const addNoteToTicket = async (req, res, next) => {
  const { content } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    let attachmentUrl = null;

    if (req.file) {
      try {
        
        const result = await cloudinary.v2.uploader.upload_stream(
          { folder: 'helpdesk', resource_type: 'auto' },
          (error, result) => {
            if (error) {
              return next(new Error(error.message || 'File not uploaded, please try again'));
            }
            attachmentUrl = result.secure_url;
          }
        );

        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: 'helpdesk', resource_type: 'auto' },
          (error, result) => {
            if (error) {
              return next(new Error(error.message || 'File not uploaded, please try again'));
            }
            attachmentUrl = result.secure_url;
          }
        );

       
        stream.end(req.file.buffer);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return next(new Error(error.message || 'File not uploaded, please try again'));
      }
    } else {
      console.log('No file uploaded'); 
    }

    
    ticket.notes.push({
      author: req.user.id,
      content,
      attachments: attachmentUrl,
      timestamp: Date.now(),
    });

    ticket.lastUpdatedOn = Date.now();
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Error adding note to ticket', error: error.message });
  }
};


export const getNotesForTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('notes.author');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.json(ticket.notes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notes for ticket', error: error.message });
  }
};


export const updateTicketStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Agent', 'Admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Permission denied' });
  }

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = status;
    ticket.lastUpdatedOn = Date.now();
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket status', error: error.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    res.json({ status: ticket.status }); // Return the ticket status
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ticket status', error: error.message });
  }
};
