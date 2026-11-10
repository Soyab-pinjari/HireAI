
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Menu,
  X,
  User,
  FileText,
  Bookmark,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSession, logoutUser } from '../../Redux/authSlice';

import { persistor } from "../../Redux/store";
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsOpen(false);
    setProfileOpen(false);
  };
const handleLogout = async () => {
  console.log("Logout button clicked");

  try {
    const response = await dispatch(logoutUser()).unwrap();

    console.log("Logout API success:", response);

  } catch (error) {
    console.log("Logout API error:", error);

  } finally {
    // Clear Redux state
    dispatch(clearSession());

    // Clear Redux Persist
    await persistor.purge();

    // Redirect to login
    closeMenu();
    navigate("/login", { replace: true });
  }
};

  // Default profile image
  const profileImage =
    user?.profileImage || '/default-avatar.png';

  return (
    <nav className="relative flex justify-between items-center border-b border-gray-200 shadow-md px-5 md:px-8 py-4 bg-white">

      {/* Logo */}
      <Link
        to="/"
        onClick={closeMenu}
        className="flex items-center gap-2 text-2xl font-bold text-blue-700"
      >
        <BriefcaseBusiness size={30} />
        HireAI
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-5 lg:gap-7 text-gray-700 font-medium">
        <li><Link to="/" className="hover:text-blue-700">Home</Link></li>
        <li><Link to="/jobs" className="hover:text-blue-700">Jobs</Link></li>
        <li><Link to="/companies" className="hover:text-blue-700">Companies</Link></li>
        <li><Link to="/aitools" className="hover:text-blue-700">AI Tools</Link></li>
        <li><Link to="/about" className="hover:text-blue-700">About</Link></li>
      </ul>

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center gap-4">

        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button className="bg-white text-blue-700 font-semibold px-5 py-2 border-2 border-blue-700 rounded-lg hover:text-white hover:bg-blue-700 transition">
                Login
              </button>
            </Link>

            <Link to="/register">
              <button className="my-button">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <div className="relative">

            {/* Profile Button */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition"
            >
              <img
                src={profileImage}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/default-avatar2.jpg';
                }}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
              />

              <span className="font-semibold text-gray-700">
                {user?.name || 'My Account'}
              </span>

              <ChevronDown size={18} />
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50">

                <div className="px-4 py-3 border-b">
                  <p className="font-semibold text-gray-800">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50"
                >
                  <User size={18} />
                  My Profile
                </Link>

                <Link
                  to="/my-applications"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50"
                >
                  <FileText size={18} />
                  My Applications
                </Link>

                <Link
                  to="/saved-jobs"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50"
                >
                  <Bookmark size={18} />
                  Saved Jobs
                </Link>

                <Link
                  to="/settings"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50"
                >
                  <Settings size={18} />
                  Settings
                </Link>

                <div className="border-t mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-blue-700"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t z-50 md:hidden">

          <ul className="flex flex-col gap-5 py-6 px-6 text-gray-700 font-medium">

            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/jobs" onClick={closeMenu}>Jobs</Link></li>
            <li><Link to="/companies" onClick={closeMenu}>Companies</Link></li>
            <li><Link to="/aitools" onClick={closeMenu}>AI Tools</Link></li>
            <li><Link to="/about" onClick={closeMenu}>About</Link></li>

            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={closeMenu}>
                  <button className="w-full border-2 border-blue-700 text-blue-700 py-2 rounded-lg">
                    Login
                  </button>
                </Link>

                <Link to="/register" onClick={closeMenu}>
                  <button className="my-button w-full">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 border-t pt-4">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                  />

                  <div>
                    <p className="font-semibold">
                      {user?.name || 'My Account'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Link to="/profile" onClick={closeMenu}>
                  My Profile
                </Link>

                <Link to="/my-applications" onClick={closeMenu}>
                  My Applications
                </Link>

                <Link to="/saved-jobs" onClick={closeMenu}>
                  Saved Jobs
                </Link>

                <Link to="/settings" onClick={closeMenu}>
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-left text-red-600 border-t pt-4"
                >
                  Logout
                </button>
              </>
            )}

          </ul>
        </div>
      )}

    </nav>
  );
}

export default Navbar;
