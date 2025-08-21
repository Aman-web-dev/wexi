




const StatusBadge = ({ status }) => {
  const statusConfig = {
    open: { color: 'bg-blue-100 text-blue-800', icon: MessageCircle },
    triaged: { color: 'bg-purple-100 text-purple-800', icon: Bot },
    waiting_human: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    closed: { color: 'bg-gray-100 text-gray-800', icon: X }
  };

  const config = statusConfig[status] || statusConfig.open;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {status.replace('_', ' ')}
    </span>
  );
};



export default StatusBadge;