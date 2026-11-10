
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// REGISTER
export const userRegister = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

// LOGIN
export const UserLogin = async (userData) => {
  const { data } = await api.post("/auth/login", userData);
  return data;
};

// LOGOUT
export const UserLogout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

// JOBSEEKER DASHBOARD
export const getJobseekerDashboard = async () => {
  const { data } = await api.get("/user/jobseeker/dashboard");
  return data;
};

// RECRUITER DASHBOARD
export const getRecruiterDashboard = async () => {
  const { data } = await api.get("/user/recruiter/dashboard");
  return data;
};

// ADMIN DASHBOARD
export const getAdminDashboard = async () => {
  const { data } = await api.get("/user/admin/dashboard");
  return data;
};
