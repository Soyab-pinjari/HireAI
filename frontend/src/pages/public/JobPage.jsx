
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GetJobDetails } from "../../services/api";
import ApplyButton from "../../component/jobseeker/ApplyButton";
import { useSelector } from "react-redux";

const JobPage = () => {
  const { jobId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await GetJobDetails(jobId);

        if (response.success) {
          setJob(response.job);
          setCompany(response.company);
        } else {
          setError(response.message || "Job not found");
        }
      } catch (err) {
         console.log("JOB DETAILS ERROR:", err);
  console.log("ERROR RESPONSE:", err.response?.data);
  console.log("STATUS:", err.response?.status);
        setError(
          err.response?.data?.message || "Failed to load job details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {error || "Job not found"}
        </h2>
        <Link
          to="/jobs"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

 return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">

            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
            >
                ← Back to Home
            </Link>

            {/* Job Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {job.jobTitle}
                        </h1>

                        <p className="text-gray-500 mt-2">
                            {company?.companyName || "Company"} · {job.address}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5">
                            <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                                {job.type}
                            </span>

                            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                                {job.experience} Years Experience
                            </span>

                            <span className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                                {job.vacancies} Vacancies
                            </span>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-5 min-w-[180px]">
                        <p className="text-sm text-gray-500">
                            Salary
                        </p>

                        <h2 className="text-2xl font-bold text-green-600 mt-1">
                            ₹{Number(job.salary).toLocaleString("en-IN")}
                        </h2>
                    </div>

                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Side */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Description */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Job Description
                        </h2>

                        <p className="text-gray-600 leading-8 whitespace-pre-line">
                            {job.description}
                        </p>

                    </div>

                    {/* Skills */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

                        <h2 className="text-xl font-bold text-gray-900 mb-5">
                            Required Skills
                        </h2>

                        <div className="flex flex-wrap gap-3">
                            {job.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                    </div>

                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">


                    {/* Company Details */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

                        <h2 className="text-xl font-bold mb-5 text-gray-900">
                            About Company
                        </h2>

                        <div className="flex items-center gap-3 mb-6">

                            {company?.profileImage ? (
                                <img
                                    src={company.profileImage}
                                    alt={company.companyName}
                                    className="w-16 h-16 rounded-xl object-cover border"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-500">
                                        {company?.companyName?.charAt(0)}
                                    </span>
                                </div>
                            )}

                            <div>
                                <h3 className="font-bold text-gray-900">
                                    {company?.companyName}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {company?.industry}
                                </p>
                            </div>

                        </div>

                        <div className="space-y-5 text-sm">

                            <div>
                                <p className="text-gray-400 mb-1">Company Email</p>
                                <p className="font-medium text-gray-700 break-all">
                                    {company?.companyEmail || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-400 mb-1">Phone</p>
                                <p className="font-medium text-gray-700">
                                    {company?.phone || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-400 mb-1">Company Size</p>
                                <p className="font-medium text-gray-700">
                                    {company?.companySize || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-400 mb-1">Founded Year</p>
                                <p className="font-medium text-gray-700">
                                    {company?.foundedYear || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-400 mb-1">Location</p>
                                <p className="font-medium text-gray-700">
                                    {[company?.city, company?.state, company?.country]
                                        .filter(Boolean)
                                        .join(", ") || "Not available"}
                                </p>
                            </div>

                            {company?.website && (
                                <div>
                                    <p className="text-gray-400 mb-1">Website</p>

                                    <a
                                        href={
                                            company.website.startsWith("http")
                                                ? company.website
                                                : `https://${company.website}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                    >
                                        {company.website}
                                    </a>
                                </div>
                            )}

                        </div>
<ApplyButton jobId={job._id}
  jobSeeker={user}/>
                    </div>

                </div>

            </div>
        </div>
    </div>
);
};

export default JobPage;
