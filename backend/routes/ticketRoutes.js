import express from 'express';

import { assignTicket,replyToTicket,getTicketById,getTickets,createTicket ,updateTicket} from '../controllers/ticketController.js';
import { auth } from '../middleware/authMiddleware.js';

const TicketRoutes = express.Router();


TicketRoutes.use(auth);
TicketRoutes.post("/", createTicket);
TicketRoutes.get("/", getTickets); 
TicketRoutes.put("/:id", updateTicket);
TicketRoutes.get("/:id", getTicketById);
TicketRoutes.post("/:id/reply", replyToTicket);
TicketRoutes.post("/:id/assign", assignTicket);

export default TicketRoutes;