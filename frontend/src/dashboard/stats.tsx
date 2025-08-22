

function Stats() {
      const stats = [
    { label: "Total Tickets", value: "1,247", change: "+12%", trend: "up" },
    { label: "Auto-Resolved", value: "856", change: "+8%", trend: "up" },
    {
      label: "Avg Resolution Time",
      value: "2.4h",
      change: "-15%",
      trend: "down",
    },
    { label: "Satisfaction Score", value: "4.8", change: "+0.2", trend: "up" },
  ];
  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Tickets
          </h2>
        
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            AI Performance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Classification Accuracy
              </span>
              <span className="text-sm font-medium text-gray-900">94%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Auto-Resolution Rate
              </span>
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
}

export default Stats;
