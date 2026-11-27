
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GetJobDetails, getSavedJobsApi, removeSavedJobApi, saveJobApi } from "../../services/api";
import ApplyButton from "../../component/jobseeker/ApplyButton";
import { useSelector } from "react-redux";

const JobPage = () => {
const { jobId } = useParams();
const { user } = useSelector((state) => state.auth);
const [job, setJob] = useState(null);
const [company, setCompany] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [savedJobIds, setSavedJobIds] = useState([]);
const [savedJobs, setSavedJobs] = useState([]);

console.log("user",user);
// Fetch Job Details
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

            setError(
                err.response?.data?.message ||
                "Failed to load job details"
            );

        } finally {
            setLoading(false);
        }
    };

    if (jobId) fetchJobDetails();

}, [jobId]);


// Fetch Saved Jobs
useEffect(() => {

    if (user?.role !== "jobseeker") return;

    const fetchSavedJobs = async () => {
        try {
            const res = await getSavedJobsApi();

            const jobs = res.savedJobs || [];

            setSavedJobs(jobs);

            setSavedJobIds(
                jobs
                    .filter(item => item.job)
                    .map(item => String(item.job._id))
            );

        } catch (error) {
            console.log("Saved jobs error:", error);
        }
    };

    fetchSavedJobs();

}, [user?.role]);


// Save / Unsave Job
const handleSaveJob = async () => {

    if (!job?._id) return;

    const currentJobId = String(job._id);

    const isSaved = savedJobIds.includes(currentJobId);

    try {

        if (isSaved) {

            const savedJob = savedJobs.find(
                item => String(item.job?._id) === currentJobId
            );

            if (!savedJob) return;

            await removeSavedJobApi(savedJob._id);

            setSavedJobIds(prev =>
                prev.filter(id => id !== currentJobId)
            );

            setSavedJobs(prev =>
                prev.filter(item => item._id !== savedJob._id)
            );

        } else {

            const res = await saveJobApi(currentJobId);

            setSavedJobIds(prev => [...prev, currentJobId]);

            if (res.savedJob) {
                setSavedJobs(prev => [...prev, res.savedJob]);
            }

        }

    } catch (error) {

        console.error("SAVE JOB ERROR:", error);

        alert(
            error.response?.data?.message ||
            "Unable to update saved job"
        );
    }
};
 





if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            Loading job details...
        </div>
    );
}

if (error || !job) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold">
                {error || "Job not found"}
            </h2>

            <Link to="/jobs" className="text-blue-600">
                Back to Jobs
            </Link>
        </div>
    );
}
return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">

            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-6"
            >
                <span>←</span> Back to Home
            </Link>

            {/* Job Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-7">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

                    {/* Job Information */}
                    <div className="flex-1">
                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4">
                            Job Opportunity
                        </span>

                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                            {job.jobTitle}
                        </h1>

                        <p className="text-slate-500 mt-3 text-sm md:text-base">
                            <span className="font-semibold text-slate-700">
                                {company?.companyName || "Company"}
                            </span>
                            <span className="mx-2">·</span>
                            {job.address}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                                💼 {job.type}
                            </span>

                            <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold">
                                ✦ {job.experience} Years Experience
                            </span>

                            <span className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold">
                                👥 {job.vacancies} Vacancies
                            </span>
                        </div>
                    </div>

                    {/* Salary and Actions */}
                    <div className="lg:min-w-[240px] lg:border-l lg:border-slate-100 lg:pl-7">

                        <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                                Offered Salary
                            </p>

                            <h2 className="text-2xl font-extrabold text-emerald-600 mt-1">
                                ₹{Number(job.salary).toLocaleString("en-IN")}
                            </h2>
                        </div>
                     {user?.role === "jobseeker" ? (
                        <div className="flex flex-col gap-3">
                            <ApplyButton
                                jobId={job._id}
                                jobSeeker={user}
                            />
                                                {user?.role === "jobseeker" && (
                                                    <button
                                                        onClick={handleSaveJob}
                                                        className={`px-5 py-3 rounded-xl font-semibold text-sm
                                                        flex items-center justify-center gap-2
                                                        transition-all duration-200 border
                                                        ${
                                                            savedJobIds.includes(String(job._id))
                                                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                                : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                                        }`}
                                                    >
                                                        {savedJobIds.includes(String(job._id)) ? (
                                                            <>
                                                                <icon name="bookmark-check" size="sm" />
                                                                Saved
                                                            </>
                                                        ) : (
                                                            <>
                                                                <icon name="bookmark" size="sm" />
                                                                Save Job
                                                            </>
                                                        )}
                                                                        </button>
                                                        )}
                        </div>
                     ):null}


                    </div>

                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

                {/* Left Content */}
                <div className="lg:col-span-2 space-y-7">

                    {/* Job Description */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                                📋
                            </div>

                            <h2 className="text-xl font-bold text-slate-900">
                                Job Description
                            </h2>
                        </div>

                        <p className="text-slate-600 leading-8 whitespace-pre-line text-[15px]">
                            {job.description}
                        </p>
                    </div>

                    {/* Required Skills */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
                                ✨
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Required Skills
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">
                                    Skills needed for this position
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {job.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition"
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
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                        <h2 className="text-lg font-bold text-slate-900 mb-6">
                            About Company
                        </h2>

                        {/* Company Profile */}
                        <div className="flex items-center gap-4 mb-7 pb-6 border-b border-slate-100">

                            {company?.profileImage ? (
                                <img
                                    src={company.profileImage}
                                    alt={company.companyName}
                                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl font-bold text-blue-600">
                                        {company?.companyName?.charAt(0) || "C"}
                                    </span>
                                </div>
                            )}

                            <div className="min-w-0">
                                <h3 className="font-bold text-slate-900 text-base break-words">
                                    {company?.companyName || "Company"}
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    {company?.industry || "Industry not specified"}
                                </p>
                            </div>
                        </div>

                        {/* Company Information */}
                        <div className="space-y-5">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                                    Company Email
                                </p>
                                <p className="text-sm font-medium text-slate-700 break-all">
                                    {company?.companyEmail || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                                    Phone
                                </p>
                                <p className="text-sm font-medium text-slate-700">
                                    {company?.phone || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                                    Company Size
                                </p>
                                <p className="text-sm font-medium text-slate-700">
                                    {company?.companySize || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                                    Founded Year
                                </p>
                                <p className="text-sm font-medium text-slate-700">
                                    {company?.foundedYear || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                                    Location
                                </p>
                                <p className="text-sm font-medium text-slate-700">
                                    {[
                                        company?.city,
                                        company?.state,
                                        company?.country
                                    ].filter(Boolean).join(", ") || "Not available"}
                                </p>
                            </div>

                            {company?.website && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                                        Website
                                    </p>

                                    <a
                                        href={
                                            company.website.startsWith("http")
                                                ? company.website
                                                : `https://${company.website}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
                                    >
                                        {company.website}
                                    </a>
                                </div>
                            )}

                        </div>

                        {/* Apply Button in Sidebar */}
                            {user?.role ==="jobseeker"?(
                        <div className="mt-7 pt-6 border-t border-slate-100">
                            <p className="text-sm font-semibold text-slate-800 mb-3">
                                Interested in this company?
                            </p>
                                <ApplyButton
                                jobId={job._id}
                                jobSeeker={user}
                                />
                        </div>
                            ):null}

                    </div>

                </div>
            </div>

        </div>
    </div>
);

};

export default JobPage;
