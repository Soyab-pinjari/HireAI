
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/authSlice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = await dispatch(loginUser(formData)).unwrap();

    console.log("New Logged In User:", user);

    // Verify role
    if (user.role === "jobseeker") {
      navigate("/jobseeker", { replace: true });
    } else if (user.role === "recruiter") {
      navigate("/recruiter/dashboard", { replace: true });
    } else if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }

  } catch (err) {
    console.error("Login Error:", err);
  }
};

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-8 bg-slate-50">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
      >

        {/* Home Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Home
        </Link>

        {/* Heading */}
        <div className="text-center space-y-2">

          <h1 className="text-3xl font-bold text-blue-600">
            HireAI
          </h1>

          <h2 className="text-2xl font-bold text-slate-800">
            Welcome Back 👋
          </h2>

          <p className="text-sm text-slate-500">
            Login to your account
          </p>

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
            autoComplete="email"
            required
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
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              minLength={6}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>

          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex justify-between items-center gap-3 text-sm">

          <label className="flex items-center gap-2 text-slate-600">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
              className="accent-blue-600"
            />

            Remember me

          </label>

          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>

        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 text-red-600 text-sm p-3 rounded-lg"
          >
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-center text-sm text-slate-600">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;
