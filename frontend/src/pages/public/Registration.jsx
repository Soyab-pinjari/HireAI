
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff, UserRound, Building2, BriefcaseBusiness } from "lucide-react";
import { userRegister } from "../../services/api";

function Registration() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Select account type
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError("");
  };

  // Register user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (password.length < 6) {
      return setError("Password must contain at least 8 characters.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!selectedRole) {
      return setError("Please select an account type.");
    }

    try {
      setLoading(true);

      const  Data  = await userRegister(
        {
          name,
          email,
          password,
          role: selectedRole
        }
      );

      if (Data.success) {
        navigate("/login", {
          state: { message: "Registration successful! Please login." }
        });
      }

    } catch (err) {
      setError(
        err.response?.Data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Role Selection */}
      {!selectedRole && (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

          {/* Recruiter Panel */}
          <div className="bg-[#1a76ff] flex flex-col justify-center items-center text-white px-6 py-12 gap-5 text-center">

            <Building2 size={38} />

            <h1 className="text-3xl md:text-4xl font-bold">
              I'm Here for Hiring
            </h1>

            <p className="text-blue-100 max-w-sm">
              Find talented candidates and hire the right people for your company.
            </p>

            <img
              src="/hiring-man.png"
              alt="Recruiter"
              className="h-48 sm:h-64 md:h-72 w-auto object-contain"
            />

            <button
              onClick={() => handleRoleSelect("recruiter")}
              className="my-button w-70 transition"
            >
              Signup as Recruiter
            </button>

            <p className="text-sm text-white">
              Already have an account?
              <Link to="/login" className="underline  ml-1 font-semibold">
                Login here
              </Link>
            </p>

          </div>

          {/* Job Seeker Panel */}
          <div className="bg-[#6cccfe] flex flex-col justify-center items-center text-white px-6 py-12 gap-5 text-center">

            <UserRound size={38} />

            <h1 className="text-3xl md:text-4xl font-bold">
              I'm Here for a Job
            </h1>

            <p className=" text-white max-w-sm">
              Discover exciting opportunities and find your dream job with AI.
            </p>

            <img
              src="/job-seeker-women.png"
              alt="Job Seeker"
              className="h-48 sm:h-64 md:h-72 w-auto object-contain"
            />

            <button
              onClick={() => handleRoleSelect("jobseeker")}
             className="my-button w-70 transition"
            >
              Signup as Job Seeker
            </button>

            <p className="text-sm text-white">
              Already have an account?
              <Link to="/login" className="underline text-blue-600 ml-1 font-semibold">
                Login here
              </Link>
            </p>

          </div>

        </div>
      )}

      {/* Registration Form */}
      {selectedRole && (
        <div className="min-h-screen flex justify-center items-center px-4 ">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5 sm:p-7">

            {/* Back Button */}
            <button
              onClick={() => setSelectedRole("")}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6"
            >
              <ArrowLeft size={18} />
              Back to account selection
            </button>

            {/* Heading */}
            <div className="text-center mb-7">

              {/* <div className="bg-blue-100 text-blue-600 p-3 rounded-xl inline-flex mb-4">
                {selectedRole === "recruiter" ? (
                  <Building2 size={30} />
                ) : (
                  <BriefcaseBusiness size={30} />
                )}
              </div> */}

              <h1 className="text-3xl font-bold text-slate-900">
                Create Account
              </h1>

              <p className="text-slate-500 mt-2">
                Register as{" "}
                <span className="text-blue-600 font-semibold">
                  {selectedRole === "recruiter" ? "Recruiter" : "Job Seeker"}
                </span>
              </p>

            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 text-sm mb-5">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>

                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?
              <Link
                to="/login"
                className="text-blue-600 font-semibold ml-1 hover:underline"
              >
                Login
              </Link>
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default Registration;
