





const TicketList = ({ onViewTicket }) => {



  const { user } = useAuth();
  const [tickets, setTickets] = useState(mockTickets);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600 mt-2">Manage and track support requests</p>
        </div>
        {user?.role === 'user' && (
          <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
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
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="triaged">Triaged</option>
              <option value="waiting_human">Waiting Human</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="space-y-4">
        {filteredTickets.map(ticket => (
          <div key={ticket.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                  <StatusBadge status={ticket.status} />
                  {ticket.agentSuggestion && (
                    <div className="flex items-center text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      <Bot className="h-3 w-3 mr-1" />
                      AI: {Math.round(ticket.agentSuggestion.confidence * 100)}%
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{ticket.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>#{ticket.id}</span>
                  <span>{ticket.category}</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewTicket(ticket.id)}
                  className="inline-flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};


export default TicketList;