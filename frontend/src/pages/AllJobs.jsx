
import React, { useEffect, useState } from "react";
import { getAllJobs, deleteJob } from "../services/api";
import { Link } from "react-router-dom";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data.jobs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      const res = await deleteJob(id);

      alert(res.data.message);

      setJobs((prev) =>
        prev.filter((job) => job._id !== id)
      );

    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading jobs...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            All Jobs
          </h1>

          <Link
            to="/create-job"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            + Create Job
          </Link>

        </div>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">
            No jobs found.
          </p>
        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {jobs.map((job) => (

              <div
                key={job._id}
                className="bg-white rounded-xl shadow p-6"
              >

                <h2 className="text-xl font-bold mb-2">
                  {job.jobTitle}
                </h2>

                <p className="text-blue-600 font-medium">
                  {job.company?.companyName || "Company"}
                </p>

                <div className="mt-4 space-y-2 text-gray-600">

                  <p>Type: {job.type}</p>

                  <p>Experience: {job.experience || "Not specified"}</p>

                  <p>Salary: ₹{job.salary}</p>

                  <p>Vacancies: {job.vacancies ?? "Not specified"}</p>

                  <p>Address: {job.address}</p>

                  <p>
                    Skills: {Array.isArray(job.skills)
                      ? job.skills.join(", ")
                      : job.skills}
                  </p>

                </div>

                <p className="mt-4 text-gray-500 line-clamp-3">
                  {job.description}
                </p>

                <div className="flex gap-3 mt-6">

                  <Link
                    to={`/edit-job/${job._id}`}
                    className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>

                  <Link
                    to={`/job/${job._id}`}
                    className="flex-1 text-center bg-gray-800 text-white py-2 rounded-lg"
                  >
                    View
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
};

export default AllJobs;
