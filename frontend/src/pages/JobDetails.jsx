
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById } from "../services/jobApi";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobById(id)
      .then((res) => setJob(res.data.job))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;

  if (!job) return <p className="p-10">Job not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">

        <Link to="/jobs" className="text-blue-600">
          ← Back to Jobs
        </Link>

        <h1 className="text-3xl font-bold mt-5">
          {job.jobTitle}
        </h1>

        <h2 className="text-blue-600 text-xl mt-2">
          {job.company?.companyName}
        </h2>

        <div className="mt-6 space-y-3 text-gray-700">
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Experience:</strong> {job.experience || "Not specified"}</p>
          <p><strong>Salary:</strong> ₹{job.salary}</p>
          <p><strong>Vacancies:</strong> {job.vacancies ?? "Not specified"}</p>
          <p><strong>Address:</strong> {job.address}</p>
          <p>
            <strong>Skills:</strong>{" "}
            {Array.isArray(job.skills) ? job.skills.join(", ") : job.skills}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-3">
            Job Description
          </h3>
          <p className="text-gray-600 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <Link
          to={`/edit-job/${job._id}`}
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg mt-8"
        >
          Edit Job
        </Link>

      </div>
    </div>
  );
};

export default JobDetails;
