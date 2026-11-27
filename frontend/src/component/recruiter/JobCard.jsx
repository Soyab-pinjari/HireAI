
import { Link } from "react-router-dom";

const JobCard = ({ job, onDelete }) => {


  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">

      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {job.jobTitle}
          </h2>

          <p className="text-blue-600 font-medium mt-1">
            {job.company?.companyName || "Company"}
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          {job.type}
        </span>

      </div>

      <div className="mt-5 space-y-3 text-gray-600">

        <p>📍 {job.address}</p>

        <p>💰 ₹{job.salary}</p>

        <p>💼 {job.experience || "Experience not specified"}</p>

        <p>👥 {job.vacancies ?? "Not specified"} Vacancies</p>

        <p>
          <strong>Skills:</strong>{" "}
          {Array.isArray(job.skills)
            ? job.skills.join(", ")
            : job.skills}
        </p>

      </div>

      <p className="text-gray-500 mt-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex gap-2 mt-6">

        <Link
          to={`/job/${job._id}`}
          className="flex-1 text-center bg-slate-800 text-white py-2 rounded-lg"
        >
          View
        </Link>

        <Link
          to={`/edit-job/${job._id}`}
          className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(job._id)}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>
  );
};

export default JobCard;
