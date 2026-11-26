
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

export const CheckAuth = async () => {
  const response = await api.get("/auth/check-auth");
  return response.data;
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



//// JOBS

export const createJob = (data) =>
  api.post("/job/create", data);


export const getAllJobs = () =>
  api.get("/job/all");


export const getJobById = (id) =>
  api.get(`/job/${id}`);


export const updateJob = async (id, data) => {
  const response = await api.put(`/job/update/${id}`, data);
  return response.data;
};


export const deleteJob = (id) =>
  api.delete(`/job/delete/${id}`);

export const getJobsByCompany = (companyId) =>
  api.get(`/job/company/${companyId}`);

export const getMyCompanyJobs = async () => {
  const { data } = await api.get("/job/company-jobs");
  console.log("api",data.jobs);
  return data;
};

export const GetJobDetails = async (jobId) => {
  const response = await api.get(`/job/job-details/${jobId}`);
  return response.data;
};


///jobseeker
export const getJobSeekerProfile = async () => {
    const res = await api.get("/user/jobseeker/profile");
    return res.data;
};

export const updateJobSeekerProfile = async (data) => {
    const res = await api.put(
        "/user/jobseeker/profile",
        data
    );
    return res.data;
};

export const uploadJobSeekerProfileImage = async (file) => {
    const formData = new FormData();

    formData.append("profileImage", file);

    const res = await api.post(
        "/user/jobseeker/profile/image",
        formData
    );

    return res.data;
};

export const uploadJobSeekerResume = async (file) => {

    const formData = new FormData();

    formData.append("resume", file);

    const res = await api.post(
        "/user/jobseeker/profile/resume",
        formData
    );

    return res.data;
};


export const applyForJob = async (jobId, coverLetter) => {
    const res = await api.post("/application/apply", {
        jobId,
        coverLetter
    });

    return res.data;
};


