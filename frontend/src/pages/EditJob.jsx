
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetJobDetails, updateJob } from "../services/api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [companyData, setCompanyData] = useState({
  companyName: "",
  profileImage: "",
});
  const [formData, setFormData] = useState({
    jobTitle: "",
    type: "",
    company: "",
    experience: "",
    salary: "",
    vacancies: "",
    address: "",
    skills: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
  try {
    console.log("Job ID:", id);

   const res = await GetJobDetails(id);

console.log("GET JOB RESPONSE:", res);
const company = res.company;

setCompanyData({
  companyName: company?.companyName || "",
  profileImage: company?.profileImage || "",
});
const job = res.job;

console.log("JOB DATA:", job);

    if (!job) {
      throw new Error("Job not found in API response");
    }

    setFormData({
      jobTitle: job.jobTitle || "",
      type: job.type || "",
      company: job.company?._id || job.company || "",
      experience: job.experience || "",
      salary: job.salary ?? "",
      vacancies: job.vacancies ?? "",
      address: job.address || "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : job.skills || "",
      description: job.description || "",
    });

  } catch (error) {
    console.log("FETCH ERROR:", error.response?.data || error);
    alert(error.response?.data?.message || "Job not found");
    navigate("/recruiter/dashboard");
  } finally {
    setLoading(false);
  }
};

    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const payload = {
  ...formData,

  company: formData.company || undefined,

  salary: Number(formData.salary),

  vacancies: formData.vacancies === ""
    ? undefined
    : Number(formData.vacancies),

  skills: formData.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean),
};

      await updateJob(id, payload);

      alert("Job updated successfully");

      navigate("/recruiter/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
  <div className="min-h-screen bg-gray-100 p-6">

    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

      <h2 className="text-3xl font-bold mb-6">
        Update Job
      </h2>

      {/* Company Information */}
      <div className="bg-gray-50 border rounded-xl p-5 mb-6">

        <h3 className="text-lg font-bold mb-4">
          Company Information
        </h3>

        <div className="flex items-center gap-4">

          <img
            src={companyData.profileImage || "/default-company.png"}
            alt="Company Logo"
            className="w-16 h-16 rounded-full object-cover border"
          />

          <p className="font-semibold">
            {companyData.companyName || "Company Name Not Available"}
          </p>

        </div>
      </div>

      {/* Job Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {Object.keys(formData)
          .filter((field) => field !== "company")
          .map((field) => (
            <div key={field}>

              <label className="block font-medium mb-2 capitalize">
                {field}
              </label>

              {field === "description" ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  rows="5"
                  className="w-full border p-3 rounded-lg"
                  required
                />
              ) : (
                <input
                  type={["salary", "vacancies"].includes(field) ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                  required={!["experience", "vacancies"].includes(field)}
                />
              )}

            </div>
          ))}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
        >
          Update Job
        </button>

      </form>
    </div>
  </div>
);
};

export default EditJob;
