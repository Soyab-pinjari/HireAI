import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Clock3,
  CheckCircle2,
  MapPin,
  Banknote,
} from "lucide-react";

import { getJobseekerDashboard } from "../../services/api";



function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JobseekerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
console.log("dashboard data ",dashboardData);
  useEffect(() => {

  const fetchDashboard = async () => {
      try {
        const response = await getJobseekerDashboard();
        setDashboardData(response);

      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }
  console.log("stats",dashboardData.stats);

  if (!dashboardData) {
    return <div className="p-8 text-sm text-slate-500">No dashboard data found.</div>;
  }

  const stats = dashboardData.stats ?? {};
  const recentApplications = dashboardData.recentApplications ?? [];
  const latestJobs = dashboardData.latestJobs ?? [];
  const statCards = [
    {
      label: "Applications",
      value: stats.totalApplications ?? 0,
      icon: FileText,
      iconStyle: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Pending",
      value: stats.pending ?? 0,
      icon: Clock3,
      iconStyle: "bg-amber-100 text-amber-600",
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted ?? 0,
      icon: CheckCircle2,
      iconStyle: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Accepted",
      value: stats.accepted ?? 0,
      icon: BriefcaseBusiness,
      iconStyle: "bg-violet-100 text-violet-600",
    },
  ];

  const appliedJobIds = new Set(
    (dashboardData.applications ?? [])
      .map((application) => application.job?._id)
      .filter(Boolean)
      .map(String)
  );
const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  reviewed: "bg-blue-50 text-blue-700",
  shortlisted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
  accepted: "bg-violet-50 text-violet-700",
};

const statusLabels = {
  pending: "Pending",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  accepted: "Accepted",
};
  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-7 lg:p-9">
      <div className="mx-auto max-w-[1400px] space-y-7">
        <header>
          <p className="mb-2 text-sm font-semibold text-indigo-600">
            Jobseeker Panel
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Track your applications and explore new opportunities.
          </p>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
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

        {/* Recent applications */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Applications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest updates on jobs you applied for.
              </p>
            </div>
          </div>

          {recentApplications.length === 0 ? (
            <div className="border-t border-slate-100 px-6 py-12 text-center">
              <p className="font-medium text-slate-700">
                You haven't applied to any jobs yet.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Browse the latest jobs below to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Job</th>
                    <th className="px-6 py-3 font-medium">Applied on</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentApplications.map((application) => {
                    const job = application.job;
                    const status = application.status;

                    return (
                      <tr key={application._id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800">
                            {job?.jobTitle || "Job no longer available"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {job?.type || "—"}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(application.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              statusStyles[status] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {statusLabels[status] || status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Latest jobs */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Latest Jobs
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Recently posted opportunities.
            </p>
          </div>

          {latestJobs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No jobs are available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {latestJobs.map((job) => {
                const alreadyApplied = appliedJobIds.has(String(job._id));

                return (
                  <article
                    key={job._id}
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                        <BriefcaseBusiness size={20} />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {job.type || "Job"}
                      </span>
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                      {job.jobTitle}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-slate-500">
                      <p className="flex items-center gap-2">
                        <MapPin size={15} />
                        {job.address || "Location not specified"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Banknote size={15} />
                        {job.salary != null
                          ? `₹${Number(job.salary).toLocaleString("en-IN")}`
                          : "Salary not specified"}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-500">
                        {job.experience ?? 0} years experience
                      </span>

                      <button
                        disabled={alreadyApplied}
                        className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                          alreadyApplied
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {alreadyApplied ? "Applied" : "Apply Now"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}