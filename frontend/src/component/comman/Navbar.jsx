
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  Menu,
  X,
  User,
  FileText,
  Bookmark,
  Settings,
  LogOut,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { clearSession, logoutUser } from "../../Redux/authSlice";
import { persistor } from "../../Redux/store";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Role Based Profile Navigation
  const handleProfileClick = () => {
    if (user?.role === "recruiter") {
      navigate("/recruiter/dashboard");
    } 
    else if (user?.role === "jobseeker") {
      navigate("/jobseeker/dashboard");
    } 
    else if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } 
    else {
      navigate("/login");
    }

    closeMenu();
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await dispatch(logoutUser()).unwrap();
      console.log("Logout API success:", response);

    } catch (error) {
      console.log("Logout API error:", error);

    } finally {
      dispatch(clearSession());
      await persistor.purge();
      closeMenu();
      navigate("/login", { replace: true });
    }
  };

  const profileImage =
    user?.profileImage || "/default-avatar.png";

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

        <li>
          <Link to="/" className="hover:text-blue-700">
            Home
          </Link>
        </li>

        <li>
          <Link to="/jobs" className="hover:text-blue-700">
            Jobs
          </Link>
        </li>

        <li>
          <Link to="/companies" className="hover:text-blue-700">
            Companies
          </Link>
        </li>

        <li>
          <Link to="/aitools" className="hover:text-blue-700">
            AI Tools
          </Link>
        </li>

        <li>
          <Link to="/about" className="hover:text-blue-700">
            About
          </Link>
        </li>

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

          /* Profile Image + Name */
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-blue-50 transition"
          >

            <img
              src={profileImage}
              alt="Profile"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default-avatar2.jpg";
              }}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
            />

            <span className="font-semibold text-gray-700">
              {user?.name || "My Account"}
            </span>

          </button>
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
        <div className="absolute top-full sticky top-0 z-50 left-0 w-full bg-white shadow-lg border-t z-50 md:hidden">

          <ul className="flex flex-col gap-5 py-6 px-6 text-gray-700 font-medium">

            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>

            <li>
              <Link to="/jobs" onClick={closeMenu}>Jobs</Link>
            </li>

            <li>
              <Link to="/companies" onClick={closeMenu}>Companies</Link>
            </li>

            <li>
              <Link to="/aitools" onClick={closeMenu}>AI Tools</Link>
            </li>

            <li>
              <Link to="/about" onClick={closeMenu}>About</Link>
            </li>

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

                {/* Mobile Profile */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-3 border-t pt-4 text-left"
                >

                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                  />

                  <div>
                    <p className="font-semibold">
                      {user?.name || "My Account"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                </button>

                <Link to="/my-applications" onClick={closeMenu}>
                  <span className="flex items-center gap-2">
                    <FileText size={18} />
                    My Applications
                  </span>
                </Link>

                <Link to="/saved-jobs" onClick={closeMenu}>
                  <span className="flex items-center gap-2">
                    <Bookmark size={18} />
                    Saved Jobs
                  </span>
                </Link>

                <Link to="/settings" onClick={closeMenu}>
                  <span className="flex items-center gap-2">
                    <Settings size={18} />
                    Settings
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-red-600 border-t pt-4"
                >
                  <LogOut size={18} />
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
