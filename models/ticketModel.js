import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Pending', 'Closed'], default: 'Active' },
  customerName: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastUpdatedOn: { type: Date, default: Date.now },
  notes: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      attachments: { type: String }, 
    }
  ]
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
