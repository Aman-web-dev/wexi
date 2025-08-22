import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowRight, 
  Bot, 
  CheckCircle, 
  RefreshCw, 
  Send, 
  Ticket,
  User,
  Calendar,
  MessageSquare,
  Eye,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../components/ticketStatusBadge';
import {useAuth} from '../context/authContext';
import TicketDetail from '../components/ticketDetail';
import CreateTicketModal from '../components/ticketCreatorModal';

import type { Ticket as TicketType } from '../types';



const TicketManagement = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('my'); 

  const API_BASE_URL = "http://localhost:9000/api/v1/tickets";

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    
    try {
      let queryParams = new URLSearchParams();
      
      if (filter !== 'all') {
        queryParams.append('status', filter);
      }

      // Role-based filtering
      if (user.role === 'user') {
        queryParams.append('mine', 'true');
      } else if (user.role === 'agent') {
        if (viewMode === 'my') {
          queryParams.append('mine', 'true');
        } else if (viewMode === 'assigned') {
          queryParams.append('agent', 'true');
          queryParams.append('mine', 'false');
        }
        // 'all' view for agents shows unassigned tickets
      } else if (user.role === 'admin') {
        if (viewMode === 'my') {
          queryParams.append('mine', 'true');
        }
        // 'all' view for admin shows all tickets
      }

      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTickets(data.data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to fetch tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create new ticket
  const createTicket = async (ticketData:any) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTickets([data.data, ...tickets]);
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchTickets();
    }
  }, [user, filter, viewMode]);

  // Filter tickets locally for search
  const filteredTickets = tickets.filter((ticket:TicketType) => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle view ticket
  const handleViewTicket = (ticketId:string) => {
    setSelectedTicket(ticketId);
  };

  // Handle back from ticket detail
  const handleBackToList = () => {
    setSelectedTicket("");
    fetchTickets(); 
  };

  // Get available view modes based on user role
  const getViewModes = () => {
    if (user.role === 'user') {
      return [{ value: 'my', label: 'My Tickets' }];
    } else if (user.role === 'agent') {
      return [
        { value: 'my', label: 'Created by Me' },
        { value: 'assigned', label: 'Assigned to Me' },
        { value: 'all', label: 'Unassigned' }
      ];
    } else if (user.role === 'admin') {
      return [
        { value: 'my', label: 'Created by Me' },
        { value: 'all', label: 'All Tickets' }
      ];
    }
    return [];
  };

  // Show ticket detail if one is selected
  if (selectedTicket) {
    return <TicketDetail ticketId={selectedTicket} onBack={handleBackToList} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600 mt-2">
            Manage and track support requests ({tickets.length} tickets)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user.role === 'user' && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </button>
          )}
          
          <button
            onClick={fetchTickets}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button
            onClick={fetchTickets}
            className="ml-2 text-red-800 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          {/* View Mode */}
          {getViewModes().length > 1 && (
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {getViewModes().map(mode => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          )}
          
          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="triaged">Triaged</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="waiting-user">Waiting User</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && tickets.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      )}

      {/* Tickets List */}
      {!loading && filteredTickets.length > 0 && (
        <div className="space-y-4">
          {filteredTickets.map((ticket:TicketType) => (
            <div 
              key={ticket._id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                    <StatusBadge status={ticket.status} />
                    {ticket.assignee && (
                      <div className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Assigned
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>#{ticket._id.slice(-6)}</span>
                    <span className="capitalize">{ticket.category.replace('-', ' ')}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    {user.role !== 'user' && ticket.createdBy && (
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        User ID: {ticket.createdBy.slice(-6)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleViewTicket(ticket._id)}
                    className="inline-flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No tickets found' : 'No tickets yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search criteria.' 
              : user.role === 'user' 
                ? 'Create your first support ticket to get started.'
                : 'No tickets match the current filters.'
            }
          </p>
          {!searchTerm && user.role === 'user' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Ticket
            </button>
          )}
        </div>
      )}

      {/* Loading indicator for refresh */}
      {loading && tickets.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Refreshing tickets...
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createTicket}
      />
    </div>
  );
};

export default TicketManagement;