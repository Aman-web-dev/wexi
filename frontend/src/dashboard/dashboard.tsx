import { useAuth } from "../context/authContext";
import StatusBadge from "../componets/statusBadge";
import { Outlet } from "react-router";
import Navigation from "../componets/navbar";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Tickets', value: '1,247', change: '+12%', trend: 'up' },
    { label: 'Auto-Resolved', value: '856', change: '+8%', trend: 'up' },
    { label: 'Avg Resolution Time', value: '2.4h', change: '-15%', trend: 'down' },
    { label: 'Satisfaction Score', value: '4.8', change: '+0.2', trend: 'up' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Navigation/>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h2>
          <div className="space-y-4">
            {/* {mockTickets.slice(0, 3).map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{ticket.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">#{ticket.id}</p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            ))} */}
          </div>
        </div>
<Outlet />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Classification Accuracy</span>
              <span className="text-sm font-medium text-gray-900">94%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-Resolution Rate</span>
              <span className="text-sm font-medium text-gray-900">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Confidence</span>
              <span className="text-sm font-medium text-gray-900">0.82</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;