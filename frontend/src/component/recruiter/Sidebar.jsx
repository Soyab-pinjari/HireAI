
import React from "react";

import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  BriefcaseBusiness,
  Users,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  clearSession,
  logoutUser,
} from "../../Redux/authSlice";

import { persistor } from "../../Redux/store";

function Sidebar({ activePage, setActivePage }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    {
      name: "Dashboard",
      id: "dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Company Profile",
      id: "profile",
      icon: Building2,
    },
    {
      name: "Post a Job",
      id: "create-job",
      icon: PlusCircle,
    },
    {
      name: "Created Jobs",
      id: "jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Applicants",
      id: "applicants",
      icon: Users,
    },
  ];

  // Logout Function
 const handleLogout = async () => {
  try {
    await dispatch(logoutUser()).unwrap();
  } catch (error) {
    console.log("Logout API error:", error);
  } finally {
    dispatch(clearSession());

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("recruiter");

    sessionStorage.clear();

    navigate("/", { replace: true });
  }
};

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-white border-r shadow-sm flex flex-col z-50">

      {/* Logo */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          HireAI<span className="text-indigo-600">Portal</span>
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          Recruiter Panel
        </p>
      </div>

      {/* Recruiter Info */}
      <div className="p-5">
        <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-xl">
          <div className="w-11 h-11 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
            R
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Recruiter
            </h3>

            <p className="text-xs text-gray-500">
              Manage your account
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 flex-1">
        <p className="text-xs text-gray-400 font-semibold px-3 mb-3">
          MAIN MENU
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition"
        >
          <LogOut size={20} />
          Logout
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          © 2026 JobPortal
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;
