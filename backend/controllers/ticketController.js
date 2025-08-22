import Ticket from "../models/ticketModel.js";
import mongoose from "mongoose";

// POST /api/tickets (user)
export const createTicket = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !req.user || !req.user._id) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "Title, description, and user required",
        });
    }
    const ticket = new Ticket({
      title,
      description,
      category,
      createdBy: req.user._id,
    });
    await ticket.save();
    res.status(201).json({ status: "success", data: ticket });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// GET /api/tickets (filter by status/my tickets)
export const getTickets = async (req, res) => {
  try {
    const { status, mine, agent } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (mine === "true" && req.user && req.user._id) {
      console.log("Asked for user tickets of user", req.user.name);
      filter.createdBy = req.user._id;
    } else if (agent === "true" && req.user && req.user._id && mine=="false") {
      filter.assignee = req.user._id;
    }
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: tickets });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// GET /api/tickets/:id
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid ticket ID" });
    }
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res
        .status(404)
        .json({ status: "fail", message: "Ticket not found" });
    }
    res.status(200).json({ status: "success", data: ticket });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// POST /api/tickets/:id/reply (agent) → change status
export const replyToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;
    if (!reply || !status) {
      return res
        .status(400)
        .json({ status: "fail", message: "Reply and new status required" });
    }
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res
        .status(404)
        .json({ status: "fail", message: "Ticket not found" });
    }
    // Optionally, store replies in a separate collection or array. Here, just update status.
    ticket.status = status;
    ticket.updatedAt = Date.now();
    await ticket.save();
    res
      .status(200)
      .json({
        status: "success",
        message: "Reply added and status updated",
        data: ticket,
      });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// POST /api/tickets/:id/assign (admin/agent)
export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigneeId } = req.body;
    if (!assigneeId) {
      return res
        .status(400)
        .json({ status: "fail", message: "Assignee ID required" });
    }
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res
        .status(404)
        .json({ status: "fail", message: "Ticket not found" });
    }
    ticket.assignee = assigneeId;
    ticket.updatedAt = Date.now();
    await ticket.save();
    res
      .status(200)
      .json({ status: "success", message: "Ticket assigned", data: ticket });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
