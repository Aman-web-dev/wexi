import React, { useState } from "react";
import {
  Home,
  Ticket,
  BookOpen,
  Settings,
  LogOut,
  Bot,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/authContext.tsx";
import { useNavigate } from "react-router";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigator= useNavigate();

  const menuItems = [
    {
      id: "",
      label: "Dashboard",
      icon: Home,
      roles: ["admin", "agent", "user"],
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: Ticket,
      roles: ["admin", "agent", "user"],
    },
    {
      id: "knowledgebase",
      label: "Knowledge Base",
      icon: BookOpen,
      roles: ["admin", "agent"],
    },
    { id: "settings", label: "Settings", icon: Settings, roles: ["admin"] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Wexi
              </span>
            </div>

            <div className="hidden md:flex space-x-1">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={()=>navigator(`/dashboard/${item.id}`)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    `}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-sm text-gray-600">{user?.name}</div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user?.role === "admin"
                    ? "bg-red-100 text-red-800"
                    : user?.role === "agent"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user?.role}
              </div>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  // onClick={() => {
                  //   onNavigate(item.id);
                  //   setMobileMenuOpen(false);
                  // }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                `}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
