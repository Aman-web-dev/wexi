import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  UserCheck,
  Send,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import StatusBadge from "./ticketStatusBadge";
import type { Ticket } from "../types";

const TicketDetail = ({
  ticketId,
  onBack,
}: {
  ticketId: string;
  onBack: () => void;
}) => {
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket>();
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const [assignLoading, setAssignLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: ticket?.category || "general",
    status: ticket?.status || "open",
  });
  const [savingChanges, setSavingChanges] = useState(false);
  const replies = ticket?.replies || [];
  const categories = [
    { value: "shipping", label: "Shipping" },
    { value: "tech", label: "Technical Issue" },
    { value: "billing", label: "Billing" },
    { value: "other", label: "Other" },
  ];
  const API_BASE_URL = "http://localhost:9000/api/v1/tickets";

  console.log(
    ticket?.status,
    formData.status,
    ticket?.category,
    formData.category
  );

  // Fetch ticket details
  const fetchTicket = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTicket(data.data);
      setFormData({
        category: data.data.category,
        status: data.data.status,
      });
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send reply
  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    setReplyLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${ticketId}/reply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply: replyText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setReplyText("");
      // Refresh ticket to get updated status
      fetchTicket();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Error sending reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  // Assign ticket (admin/agent only)
  const handleAssignTicket = async () => {
    if (user.role !== "admin" && user.role !== "agent") return;

    setAssignLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${ticketId}/assign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assigneeId: user.id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchTicket();
    } catch (error) {
      console.error("Error assigning ticket:", error);
      alert("Error assigning ticket. Please try again.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (
      ticket?.status == formData.status &&
      ticket?.category == formData.category
    )
      return;
    setSavingChanges(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${ticketId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchTicket();
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Error updating ticket. Please try again.");
    } finally {
      setSavingChanges(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Ticket not found</h1>
          <button
            onClick={onBack}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            ← Back to tickets
          </button>
        </div>
      </div>
    );
  }

  const canReply = user.role === "agent" || user.role === "admin";
  const canAssign =
    (user.role === "admin" || user.role === "agent") &&
    ticket.status === "open" &&
    !ticket.assignee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowRight className="h-4 w-4 mr-2 transform rotate-180" />
          Back to tickets
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Ticket #{ticket._id.slice(-6)}</span>
              <span className="capitalize">{ticket.category}</span>
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={ticket.status} />
            {canAssign && (
              <button
                onClick={handleAssignTicket}
                disabled={assignLoading}
                className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {assignLoading ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-1" />
                )}
                {assignLoading ? "Assigning..." : "Assign to Me"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Replies Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Conversation
            </h2>

            {replies.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No replies yet</p>
            ) : (
              <div className="space-y-4">
                {replies.map((reply: any, index: number) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-200 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {reply.createdBy._id || "Support Agent"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(
                          reply.createdAt || new Date()
                        ).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{reply.reply}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reply Section */}
          {canReply && ticket.status !== "closed" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Send Reply
              </h2>
              <div className="space-y-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Type your reply..."
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || replyLoading}
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {replyLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          )}
          {canReply && ticket.status !== "closed" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Update Ticket
              </h2>
              <div className="space-y-4">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "open"
                        | "triaged"
                        | "waiting_human"
                        | "resolved"
                        | "closed",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[
                    "open",
                    "triaged",
                    "waiting_human",
                    "resolved",
                    "closed",
                  ].map((stat) => (
                    <option key={stat} value={stat}>
                      {stat.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveChanges}
                    disabled={
                      (ticket.status == formData.status &&
                        ticket.category == formData.category) ||
                      savingChanges
                    }
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {replyLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ticket Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <StatusBadge status={ticket?.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {ticket.category.replace("-", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Updated:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(ticket.updatedAt).toLocaleString()}
                </span>
              </div>
              {ticket.assignee && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Assigned to:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {ticket.assignee || "Support Agent"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
