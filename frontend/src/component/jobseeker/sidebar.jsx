
import React, { useState } from "react";

import {
  LayoutDashboard,
  UserRound,
  FileCheck,
  Bookmark,
  Sparkles,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  clearSession,
  logoutUser,
} from "../../Redux/authSlice";

import { persistor } from "../../Redux/store";
import ConfirmPopup from "../comman/ConfirmPopup";

function Sidebar({ activePage, setActivePage }) {
  const navigate = useNavigate();
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const dispatch = useDispatch();
 const user = useSelector((state)=>state.auth.user);
 
  const menuItems = [
  {
    name: "Dashboard",
    id: "dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "User Profile",
    id: "profile",
    icon: UserRound,
  },
  {
    name: "Applied Jobs",
    id: "applied-jobs",
    icon: FileCheck,
  },
  {
    name: "Saved Jobs",
    id: "saved-jobs",
    icon: Bookmark,
  },
  {
    name: "AI Tools",
    id: "resume-analyzer",
    icon: Sparkles,
  },
];

  // Logout Function
 const handleLogout = async () => {
  try {
    await dispatch(logoutUser()).unwrap();
     setIsLogoutOpen(false);
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
  <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-xl min-w-0">

    <div className="w-11 h-11 shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
      <img
        src={user?.profileImage || "/default-avatar2.jpg"}
        alt="Profile"
        className="w-full h-full rounded-full object-cover"
      />
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-base text-gray-800 break-words whitespace-normal">
        {user?.name}
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
    <div className="flex justify-center p-3">
<button
  onClick={() => setIsLogoutOpen(true)}
  className="flex border-2 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold text-red-500  hover:bg-red-500 hover:text-white transition ease"
>
  Logout
  <LogOut size={22} />
</button>

<ConfirmPopup
  isOpen={isLogoutOpen}
  onClose={() => setIsLogoutOpen(false)}
  onConfirm={handleLogout}
/>
</div>
  <p className="text-xs text-center text-gray-400 mt-4">
          © 2026 JobPortal
        </p>
    </aside>
  );
}

export default Sidebar;
