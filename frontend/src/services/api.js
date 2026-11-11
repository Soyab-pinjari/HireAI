
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

export const userRegister = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const UserLogin = async (userData) => {
  const { data } = await api.post("/auth/login", userData);
  return data;
};

export const UserLogout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const getJobseekerDashboard = async () => {
  const { data } = await api.get("/user/jobseeker/dashboard");
  return data;
};

export const getRecruiterDashboard = async () => {
  const { data } = await api.get("/user/recruiter/dashboard");
  return data;
};

export const getAdminDashboard = async () => {
  const { data } = await api.get("/user/admin/dashboard");
  return data;
};
