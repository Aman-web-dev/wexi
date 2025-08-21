import express from 'express';

import { assignTicket,replyToTicket,getTicketById,getTickets,createTicket } from '../controllers/ticketController';
import { auth } from '../middleware/authMiddleware';

const TicketRouter = express.Router();


TicketRouter.use(auth);


TicketRouter.post("/", createTicket);
TicketRouter.get("/", getTickets);  
TicketRouter.get("/:id", getTicketById);
TicketRouter.post("/:id/reply", replyToTicket);
TicketRouter.post("/:id/assign", assignTicket);


TicketRouter.use("/tickets",createTicket);



export default TicketRouter;