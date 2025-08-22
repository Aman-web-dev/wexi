



type StatusKey = 'open' | 'triaged' | 'waiting_human' | 'resolved' | 'closed';

const StatusBadge = (status: string) => {
  const statusConfig: Record<StatusKey, { bg: string; text: string; label: string }> = {
    open: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Open' },
    triaged: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Triaged' },
    waiting_human: { bg: 'bg-pink-100', text: 'text-pink-800', label: 'Waiting User' },
    resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
    closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
      {config?.label}
    </span>
  );
};


export default StatusBadge;