
import JobCard from "./JobCard";

const JobList = ({ jobs, onDelete }) => {
  if (!jobs.length) {
    return (
      <div className="text-center bg-white p-10 rounded-xl">
        <h2 className="text-xl font-semibold">
          No Jobs Found
        </h2>
        <p className="text-gray-500 mt-2">
          Create your first job opportunity.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default JobList;
