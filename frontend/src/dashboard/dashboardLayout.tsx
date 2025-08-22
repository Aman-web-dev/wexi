import { useAuth } from "../context/authContext";
import StatusBadge from "../components/statusBadge";
import { Outlet } from "react-router";
import Navigation from "../components/navbar";

const Dashboard = () => {
  const { user } = useAuth();



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Navigation />
      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
