
import React, { useState } from "react";
import {
  Search,
  Users,
  BriefcaseBusiness,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const dummyApplicants = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543210",
    position: "Frontend Developer",
    experience: "2 Years",
    location: "Surat, Gujarat",
    appliedDate: "10 Nov 2026",
    status: "Pending",
    skills: ["React", "JavaScript", "CSS"],
    initials: "RS",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@gmail.com",
    phone: "9876543211",
    position: "Backend Developer",
    experience: "3 Years",
    location: "Ahmedabad, Gujarat",
    appliedDate: "09 Nov 2026",
    status: "Accepted",
    skills: ["Node.js", "MongoDB", "Express"],
    initials: "PP",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit@gmail.com",
    phone: "9876543212",
    position: "UI/UX Designer",
    experience: "1 Year",
    location: "Mumbai, Maharashtra",
    appliedDate: "08 Nov 2026",
    status: "Rejected",
    skills: ["Figma", "Adobe XD", "UI Design"],
    initials: "AV",
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 4,
    name: "Neha Shah",
    email: "neha@gmail.com",
    phone: "9876543213",
    position: "Frontend Developer",
    experience: "4 Years",
    location: "Surat, Gujarat",
    appliedDate: "07 Nov 2026",
    status: "Pending",
    skills: ["React", "Tailwind", "TypeScript"],
    initials: "NS",
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: 5,
    name: "Karan Mehta",
    email: "karan@gmail.com",
    phone: "9876543214",
    position: "Backend Developer",
    experience: "2 Years",
    location: "Vadodara, Gujarat",
    appliedDate: "06 Nov 2026",
    status: "Pending",
    skills: ["Node.js", "MySQL", "API"],
    initials: "KM",
    color: "bg-green-100 text-green-600",
  },
];

function Applicants() {
  const [applicants, setApplicants] = useState(dummyApplicants);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleStatus = (id, status) => {
    setApplicants((prev) =>
      prev.map((applicant) =>
        applicant.id === id
          ? { ...applicant, status }
          : applicant
      )
    );
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(search.toLowerCase()) ||
      applicant.position.toLowerCase().includes(search.toLowerCase()) ||
      applicant.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || applicant.status === filter;

    return matchesSearch && matchesFilter;
  });

  const total = applicants.length;
  const pending = applicants.filter((a) => a.status === "Pending").length;
  const accepted = applicants.filter((a) => a.status === "Accepted").length;
  const rejected = applicants.filter((a) => a.status === "Rejected").length;

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
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>

      </div>

      {/* Applicants List */}
      <div className="space-y-5">

        {filteredApplicants.length === 0 ? (

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

          filteredApplicants.map((applicant) => (

            <div
              key={applicant.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
            >

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                {/* Applicant Info */}
                <div className="flex gap-4">

                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${applicant.color}`}>
                    {applicant.initials}
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-gray-800">
                      {applicant.name}
                    </h2>

                    <p className="text-indigo-600 font-medium text-sm">
                      {applicant.position}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">

                      <span>
                        <Mail size={14} className="inline mr-1" />
                        {applicant.email}
                      </span>

                      <span>
                        <MapPin size={14} className="inline mr-1" />
                        {applicant.location}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Status */}
                <div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusStyle[applicant.status]}`}>
                    {applicant.status}
                  </span>
                </div>

              </div>

              {/* Details */}
              <div className="border-t border-gray-100 mt-5 pt-5">

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">

                  <span>
                    <BriefcaseBusiness size={16} className="inline mr-2" />
                    {applicant.experience} Experience
                  </span>

                  <span>
                    <Clock size={16} className="inline mr-2" />
                    Applied: {applicant.appliedDate}
                  </span>

                  <span>
                    <Phone size={16} className="inline mr-2" />
                    {applicant.phone}
                  </span>

                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-4">

                  {applicant.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-5">

                  <button
                    onClick={() => setSelectedApplicant(applicant)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  {applicant.status !== "Accepted" && (
                    <button
                      onClick={() => handleStatus(applicant.id, "Accepted")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle size={16} />
                      Accept
                    </button>
                  )}

                  {applicant.status !== "Rejected" && (
                    <button
                      onClick={() => handleStatus(applicant.id, "Rejected")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  )}

                </div>

              </div>

            </div>

          ))
        )}

      </div>

      {/* Applicant Details Modal */}
      {selectedApplicant && (

        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">

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

            <div className="space-y-3 text-gray-600">

              <h3 className="text-xl font-bold text-gray-800">
                {selectedApplicant.name}
              </h3>

              <p>Email: {selectedApplicant.email}</p>
              <p>Phone: {selectedApplicant.phone}</p>
              <p>Position: {selectedApplicant.position}</p>
              <p>Experience: {selectedApplicant.experience}</p>
              <p>Location: {selectedApplicant.location}</p>
              <p>Applied: {selectedApplicant.appliedDate}</p>
              <p>Status: {selectedApplicant.status}</p>

              <div>
                <strong>Skills:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApplicant.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
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

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </h2>
        </div>

        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}

export default Applicants;
