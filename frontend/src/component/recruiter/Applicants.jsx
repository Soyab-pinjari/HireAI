
import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  BriefcaseBusiness,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  getRecruiterApplicantsApi,
  updateApplicantStatusApi,
} from "../../services/api";
const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">
                        {title}
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {value}
                    </h2>
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};
function Applicants() {
  const [applicants, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch applicants
  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const res = await getRecruiterApplicantsApi();

      setApplications(res.applications || []);

      console.log("Applicants:", res);
    } catch (error) {
      console.error("Applicants error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Update applicant status using API
  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);

      await updateApplicantStatusApi(id, status);

      setApplications((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, status }
            : item
        )
      );

      // Update modal data if the same applicant is selected
      setSelectedApplicant((prev) =>
        prev && (prev._id || prev.id) === id
          ? { ...prev, status }
          : prev
      );

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Status update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

const getStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    reviewed: "bg-blue-100 text-blue-700 border border-blue-200",
    shortlisted: "bg-purple-100 text-purple-700 border border-purple-200",
    accepted: "bg-green-100 text-green-700 border border-green-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
  };

  return colors[status?.toLowerCase()] ||
    "bg-gray-100 text-gray-700 border border-gray-200";
};
  // Search and filter
  const filteredApplicants = applicants.filter((application) => {
  const name = application.applicant?.name || "";
  const position = application.job?.jobTitle || "";
  const email = application.applicant?.email || "";

  const matchesSearch =
    name.toLowerCase().includes(search.toLowerCase()) ||
    position.toLowerCase().includes(search.toLowerCase()) ||
    email.toLowerCase().includes(search.toLowerCase());

  const matchesFilter =
    filter === "All" ||
    application.status?.toLowerCase() === filter.toLowerCase();

  return matchesSearch && matchesFilter;
});
  // Statistics
 const total = applicants.length;

const pending = applicants.filter(
  (a) => a.status?.toLowerCase() === "pending"
).length;

const reviewed = applicants.filter(
  (a) => a.status?.toLowerCase() === "reviewed"
).length;

const shortlisted = applicants.filter(
  (a) => a.status?.toLowerCase() === "shortlisted"
).length;

const accepted = applicants.filter(
  (a) => a.status?.toLowerCase() === "accepted"
).length;

const rejected = applicants.filter(
  (a) => a.status?.toLowerCase() === "rejected"
).length;
  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

return (
  <div className="min-h-screen bg-gray-50">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Applicants
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and review candidates who applied for your jobs.
        </p>
      </div>

      <div className="bg-indigo-50 text-indigo-600 px-4 py-3 rounded-xl">
        <Users size={18} className="inline mr-2" />
        Total Applications: {total}
      </div>

    </div>

    {/* Statistics */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

      <StatCard
        title="Total Applicants"
        value={total}
        icon={<Users />}
        color="bg-blue-100 text-blue-600"
      />

      <StatCard
        title="Pending"
        value={pending}
        icon={<Clock />}
        color="bg-yellow-100 text-yellow-600"
      />

      <StatCard
        title="Accepted"
        value={accepted}
        icon={<CheckCircle />}
        color="bg-green-100 text-green-600"
      />
<StatCard
  title="Shortlisted"
  value={shortlisted}
  icon={<CheckCircle />}
  color="bg-purple-100 text-purple-600"
/>
      <StatCard
        title="Rejected"
        value={rejected}
        icon={<XCircle />}
        color="bg-red-100 text-red-600"
      />

    </div>

    {/* Search and Filter */}
    <div className="bg-white p-5 rounded-xl shadow-sm mb-6">

      <div className="flex flex-col md:flex-row gap-4">

        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-3.5 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search by name, email or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
>
  <option value="All">All Applicants</option>
  <option value="pending">Pending</option>
  <option value="reviewed">Reviewed</option>
  <option value="shortlisted">Shortlisted</option>
  <option value="accepted">Accepted</option>
  <option value="rejected">Rejected</option>
</select>

      </div>
    </div>

    {/* Applicants List */}
    <div className="space-y-5">

      {loading ? (

        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500">
            Loading applicants...
          </p>
        </div>

      ) : filteredApplicants.length === 0 ? (

        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Users size={45} className="mx-auto text-gray-300" />

          <h2 className="text-xl font-semibold mt-4">
            No Applicants Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your search or filter.
          </p>
        </div>

      ) : (

        filteredApplicants.map((application) => {

          const id = application._id;
          const applicant = application.applicant || {};
          const job = application.job || {};

          const name = applicant.name || "Unknown Applicant";
          const position = job.jobTitle || "Not specified";
          const email = applicant.email || "N/A";
          const phone = applicant.phone || "N/A";
          const location = applicant.location || "N/A";
          const experience = applicant.experience ?? "N/A";
          const skills = applicant.skills || [];
          const status = (application.status || "pending").toLowerCase();

          const appliedDate = application.createdAt
            ? new Date(application.createdAt).toLocaleDateString()
            : "N/A";

          return (

            <div
              key={id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
            >

              {/* Applicant Info */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                <div className="flex gap-4">

                 <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">

    {applicant?.profileImage ? (
        <img
            src={applicant.profileImage}
            alt={applicant?.name || "Applicant"}
            className="w-full h-full object-cover"
            onError={(e) => {
                e.currentTarget.style.display = "none";
            }}
        />
    ) : (
        <span className="text-xl font-bold text-blue-600">
            {applicant?.name?.charAt(0)?.toUpperCase() || "U"}
        </span>
    )}

</div>

                  <div>

                    <h2 className="text-lg font-bold text-gray-800">
                      {name}
                    </h2>

                    <p className="text-indigo-600 font-medium text-sm">
                      {position}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">

                      <span>
                        <Mail size={14} className="inline mr-1" />
                        {email}
                      </span>

                      <span>
                        <MapPin size={14} className="inline mr-1" />
                        {location}
                      </span>

                    </div>
                  </div>
                </div>

              {/* Status */}
<div>
  <span
    className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(status)}`}
  >
    {status}
  </span>
</div>

              </div>

              {/* Details */}
              <div className="border-t border-gray-100 mt-5 pt-5">

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">

                  <span>
                    <BriefcaseBusiness size={16} className="inline mr-2" />
                    {experience} Years Experience
                  </span>

                  <span>
                    <Clock size={16} className="inline mr-2" />
                    Applied: {appliedDate}
                  </span>

                  <span>
                    <Phone size={16} className="inline mr-2" />
                    {phone}
                  </span>

                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-4">

                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs"
                    >
                      {typeof skill === "string"
                        ? skill
                        : skill.name || "Skill"}
                    </span>
                  ))}

                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-5">

                  <button
                    onClick={() => setSelectedApplicant(application)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  {status !== "accepted" && (

                    <button
                      disabled={updatingId === id}
                      onClick={() => handleStatusChange(id, "accepted")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                      {updatingId === id ? "Updating..." : "Accept"}
                    </button>

                  )}
      
{/* Shortlist Button */}
{status !== "shortlisted" &&
//  status !== "accepted" &&
//  status !== "rejected" && (
(
  <button
    disabled={updatingId === id}
    onClick={() => handleStatusChange(id, "shortlisted")}
    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
  >
    <Users size={16} />
    {updatingId === id ? "Updating..." : "Shortlist"}
  </button>
)}

                  {status !== "rejected" && (

                    <button
                      disabled={updatingId === id}
                      onClick={() => handleStatusChange(id, "rejected")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      {updatingId === id ? "Updating..." : "Reject"}
                    </button>

                  )}

                </div>

              </div>
            </div>

          );
        })

      )}

    </div>

    {/* Applicant Details Modal */}
    {selectedApplicant && (

      <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">

        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">
              Applicant Details
            </h2>

            <button
              onClick={() => setSelectedApplicant(null)}
              className="text-gray-500 hover:text-red-500 text-2xl"
            >
              ×
            </button>

          </div>

          {/* Nested applicant data */}
          <div className="space-y-3 text-gray-600">

            <h3 className="text-xl font-bold text-gray-800">
              {selectedApplicant.applicant?.name || "Unknown Applicant"}
            </h3>

            <p>
              Email: {selectedApplicant.applicant?.email || "N/A"}
            </p>

            <p>
              Phone: {selectedApplicant.applicant?.phone || "N/A"}
            </p>

            <p>
              Position: {selectedApplicant.job?.jobTitle || "N/A"}
            </p>

            <p>
              Experience: {selectedApplicant.applicant?.experience ?? "N/A"} Years
            </p>

            <p>
              Education: {selectedApplicant.applicant?.education || "N/A"}
            </p>

            <p>
              Location: {selectedApplicant.applicant?.location || "N/A"}
            </p>

            <p>
              Applied: {selectedApplicant.createdAt
                ? new Date(selectedApplicant.createdAt).toLocaleDateString()
                : "N/A"}
            </p>

            <p>
              Status: {selectedApplicant.status || "Pending"}
            </p>

            <p>
              Cover Letter: {selectedApplicant.coverLetter || "No cover letter provided"}
            </p>

            {/* Resume */}
            <div>
              <strong>Resume:</strong>

              {selectedApplicant.applicant?.resume?.fileUrl ? (
                <a
                  href={selectedApplicant.applicant.resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline ml-2"
                >
                  View Resume
                </a>
              ) : (
                <span className="ml-2">Not uploaded</span>
              )}
            </div>

            {/* Skills */}
            <div>
              <strong>Skills:</strong>

              <div className="flex flex-wrap gap-2 mt-2">

                {(selectedApplicant.applicant?.skills || []).map(
                  (skill, index) => (

                    <span
                      key={index}
                      className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs"
                    >
                      {typeof skill === "string"
                        ? skill
                        : skill.name || "Skill"}
                    </span>

                  )
                )}

              </div>
            </div>

          </div>

          <button
            onClick={() => setSelectedApplicant(null)}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700"
          >
            Close
          </button>

        </div>
      </div>

    )}

  </div>
);

}

export default Applicants;
