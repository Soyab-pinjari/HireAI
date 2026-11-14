
import { getMyCompanyJobs } from '../../services/api';

import { Link } from "react-router-dom";

import React, { useEffect, useState } from "react";
function PublishedJobs() {
 const [jobs, setJobs] = useState([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState("");
   const [jobType, setJobType] = useState("All");
   const fetchJobs = async () => {
       try {
           const res = await getMyCompanyJobs();
       
           setJobs(res.jobs || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchJobs();
    }, []);
    
    console.log("jobs",jobs)
 
   const filteredJobs = jobs.filter((job) => {
     const searchText = search.toLowerCase();
     const matchesSearch =
     job.jobTitle?.toLowerCase().includes(searchText) ||
     job.company?.companyName?.toLowerCase().includes(searchText) ||
     job.address?.toLowerCase().includes(searchText);
     
     const matchesType =
     jobType === "All" || job.type === jobType;
     
     return matchesSearch && matchesType;
    });
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
         <p className="text-indigo-600 font-semibold animate-pulse">
           Loading jobs...
         </p>
       </div>
     );
    }
    console.log("filterdjobs",filteredJobs)
 
  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-5 py-10">

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Latest Job Openings
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Discover opportunities from top companies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">

          <input
            type="text"
            placeholder="Search job title, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Jobs</option>

            {[...new Set(jobs.map((job) => job.type).filter(Boolean))]
              .map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>

        </div>

        {/* Job Count */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredJobs.length}
            </span>{" "}
            jobs
          </p>
        </div>

        {/* Jobs */}
        {filteredJobs.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>

            <h3 className="text-lg font-bold text-slate-800">
              No jobs found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Try changing your search or filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setJobType("All");
              }}
              className="mt-5 text-indigo-600 font-semibold text-sm hover:underline"
            >
              Clear Filters
            </button>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredJobs.map((job) => {

              const skills = Array.isArray(job.skills)
                ? job.skills
                : typeof job.skills === "string"
                  ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
                  : [];

              return (
                <div
                  key={job._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >

                  {/* Company */}
                  <div className="flex justify-between items-start gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                      <img
                          src={job.company?.profileImage || "/default-company.png"}
                          alt={job.company?.companyName || "Company"}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/default-company.png";
                          }}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">
                          {job.company?.companyName || "Company"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Hiring Now
                        </p>
                      </div>

                    </div>

                    <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
                      {job.type || "Full Time"}
                    </span>

                  </div>

                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-slate-800 mt-6">
                    {job.jobTitle}
                  </h3>

                  {/* Job Details */}
                  <div className="grid grid-cols-2 gap-4 mt-5">

                    <div>
                      <p className="text-xs text-slate-400">Salary</p>
                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        ₹{job.salary ?? "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Experience</p>
                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {job.experience || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Vacancies</p>
                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {job.vacancies ?? "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="text-sm font-semibold text-slate-700 mt-1 break-words">
                        {job.address || "Not specified"}
                      </p>
                    </div>

                  </div>

                  {/* Skills */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold text-slate-500 mb-3">
                      REQUIRED SKILLS
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View Details */}
                  <div className="mt-auto pt-6">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-sm font-semibold transition"
                    >
                      View Details & Apply →
                    </Link>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>
    </div>
  )
}

export default PublishedJobs
