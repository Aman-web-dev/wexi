import express from 'express';

import { assignTicket,replyToTicket,getTicketById,getTickets,createTicket } from '../controllers/ticketController.js';
import { auth } from '../middleware/authMiddleware.js';

const TicketRoutes = express.Router();


TicketRoutes.use(auth);
TicketRoutes.post("/", createTicket);
TicketRoutes.get("/", getTickets); 
TicketRoutes.get("/:id", getTicketById);
TicketRoutes.post("/:id/reply", replyToTicket);
TicketRoutes.post("/:id/assign", assignTicket);






export default TicketRoutes;