
import {
  BriefcaseBusiness,
  Users,
  FileText,
  CalendarDays,
  MapPin,
  Eye,
  Plus,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getRecruiterDashboard } from "../../services/api";
import { Link } from "react-router";

function SectionHeading({ title, action }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-slate-900">
        {title}
      </h2>
      {action}
    </div>
  );
}

export default function RecruiterDashboard({ setActivePage }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getRecruiterDashboard();

        setDashboardData(response);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!dashboardData) return null;

  // REAL API DATA
  const statsData = dashboardData.stats || {};
  const recentApplicants = dashboardData.recentApplicants || [];
  const jobs = dashboardData.jobs || [];
console.log(dashboardData.jobs)
  // Calculate applicant statuses
  const statusCounts = recentApplicants.reduce(
    (acc, application) => {
      const status = application.status?.toLowerCase();

      if (status) {
        acc[status] = (acc[status] || 0) + 1;
      }

      return acc;
    },
    {}
  );

  const stats = [
    {
      title: "Total Jobs",
      value: statsData.totalJobs ?? jobs.length,
      icon: BriefcaseBusiness,
      iconStyle: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Total Applicants",
      value: statsData.totalApplicants ?? recentApplicants.length,
      icon: Users,
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      title: "Shortlisted",
      value: statsData.shortlisted ?? 0,
      icon: FileText,
      iconStyle: "bg-violet-100 text-violet-600",
    },
    {
      title: "Pending Review",
      value: statsData.pending ?? 0,
      icon: CalendarDays,
      iconStyle: "bg-amber-100 text-amber-600",
    },
  ];

  const pipeline = [
    {
      label: "New Applicants",
      count: statsData.pending ?? statusCounts.pending ?? 0,
      color: "bg-indigo-500",
    },
    {
      label: "Under Review",
      count: statsData.reviewed ?? statusCounts.reviewed ?? 0,
      color: "bg-blue-500",
    },
    {
      label: "Shortlisted",
      count: statsData.shortlisted ?? statusCounts.shortlisted ?? 0,
      color: "bg-violet-500",
    },
    {
      label: "Accepted",
      count: statsData.accepted ?? statusCounts.accepted ?? 0,
      color: "bg-emerald-500",
    },
  ];

  const maxPipelineCount = Math.max(
    ...pipeline.map((item) => item.count),
    1
  );

  const statusLabel = {
    pending: "New",
    reviewed: "Reviewing",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    accepted: "Accepted",
  };

  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-7 lg:p-9">
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-600">
              Recruiter Panel
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-slate-500">
              Welcome back! Here’s what’s happening with your hiring.
            </p>
          </div>

          <button
  onClick={() => setActivePage("create-job")}
  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
>
  <Plus size={18} />
  Post a Job
</button>
        </div>

        {/* REAL STATS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.iconStyle}`}>
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* APPLICATIONS AND PIPELINE */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Applications overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
            <SectionHeading title="Applications Overview" />

            <div className="mb-5">
              <span className="text-3xl font-bold text-slate-900">
                {statsData.totalApplicants ?? recentApplicants.length}
              </span>

              <p className="mt-1 text-sm text-slate-500">
                Total applications received
              </p>
            </div>

            <div className="flex h-56 items-center justify-center rounded-xl bg-slate-50">
              <div className="text-center">
                <FileText
                  size={40}
                  className="mx-auto text-indigo-400"
                />

                <p className="mt-3 font-medium text-slate-700">
                  {recentApplicants.length} recent applications
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Application analytics
                </p>
              </div>
            </div>
          </div>

          {/* Hiring pipeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading title="Hiring Pipeline" />

            <div className="space-y-5">
              {pipeline.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      {item.label}
                    </span>

                    <span className="font-semibold text-slate-900">
                      {item.count}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${
                          (item.count / maxPipelineCount) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-900">
                {statsData.totalApplicants ?? recentApplicants.length} total candidates
              </p>

              <p className="mt-1 text-xs leading-5 text-indigo-700">
                Track your applicants and manage your hiring pipeline.
              </p>
            </div>
          </div>
        </section>

        {/* RECENT APPLICANTS */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6">
            <SectionHeading
              title="Recent Applicants"
              action={
                <button className="text-sm font-semibold text-indigo-600">
                  View all
                </button>
              }
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Applied Job</th>
                  <th className="px-6 py-3">Applied Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentApplicants.length > 0 ? (
                  recentApplicants.map((application) => {
                    const applicant = application.applicant;

                    const jobTitle =
                      application.job?.jobTitle ||
                      "Job unavailable";

                    const status =
                      application.status?.toLowerCase() || "pending";

                    return (
                      <tr
                        key={application._id}
                        className="hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {applicant?.profileImage ? (
                              <img
                                src={applicant.profileImage}
                                alt={applicant.name || "Applicant"}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                                {applicant?.name?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                            )}

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {applicant?.name || "Applicant"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {applicant?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {jobTitle}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {application.createdAt
                            ? new Date(application.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                            {statusLabel[status] || status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            aria-label={`View ${applicant?.name || "applicant"}`}
                            className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-slate-400"
                    >
                      No applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ACTIVE JOBS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Your Active Jobs" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                      {job.jobTitle?.slice(0, 2).toUpperCase() || "JB"}
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {job.status || "Active"}
                    </span>
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    {job.jobTitle}
                  </h3>

                  <div className="mt-2 space-y-2 text-xs text-slate-500">
                    <p>{job.type || "Not specified"}</p>

                    <p className="flex items-center gap-1">
                      <MapPin size={13} />
                      {job.address || "Location not specified"}
                    </p>

                    <p>
                      Salary: {job.salary ?? "Not specified"}
                    </p>

                    <p>
                      Vacancies: {job.vacancies ?? 0}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">
                      <span className="font-semibold text-slate-900">
                        {job.applicantsCount ?? job.totalApplicants ?? 0}
                      </span>{" "}
                      applicants
                    </p>

                    <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                      <Link  to={`/jobs/${job._id}`}>
                      View job
                      </Link>
                      </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full py-8 text-center text-slate-400">
                No jobs posted yet.
              </p>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
