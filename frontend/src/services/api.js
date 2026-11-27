
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


export const getMyApplications = async () => {
    const res = await api.get(
        "/application/jobSeeker-applications"
    );

    return res.data;
};


// Save Job
export const saveJobApi = async (jobId) => {
    const res = await api.post("/saved-jobs/save", {
        jobId
    });

    return res.data;
};

// Get Saved Jobs
export const getSavedJobsApi = async () => {
    const res = await api.get("/saved-jobs");
    return res.data;
};

// Remove Saved Job
export const removeSavedJobApi = async (id) => {
    const res = await api.delete(`/saved-jobs/${id}`);
    return res.data;
};


/// recruiter applied jobs


// Get recruiter applicants
export const getRecruiterApplicantsApi = async () => {
    const res = await api.get(
        "/application/recruiter/applicants"
    );

    return res.data;
};

// Update applicant status
export const updateApplicantStatusApi = async (
    applicationId,
    status
) => {
    const res = await api.put(
        `/application/recruiter/applicants/${applicationId}/status`,
        { status }
    );

    return res.data;
};

// --------------ai
export const analyzeMyResumeApi = async () => {
    const response = await api.post(
        "/api/resume-ai/analyze"
    );

    return response.data;
};

export const getResumeAnalysisHistoryApi = async () => {
    const response = await api.get(
        "/api/resume-ai/history"
    );

    return response.data;
};