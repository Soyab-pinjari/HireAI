
import { useEffect, useState } from "react";

import { getRecruiterDashboard } from "../../services/api";

import CompanyProfile from "../../component/recruiter/CompanyProfile";
import Sidebar from "../../component/recruiter/Sidebar";
import CreateJob from "../CreateJob";
import AllJobs from "../public/AllJobs";
import {Link} from 'react-router-dom'
import Applicants from "../../component/recruiter/Applicants";
import {ArrowLeft} from 'lucide-react'
import PublishedJobs from "../../component/recruiter/PublishedJobs";
function Recruiter() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activePage, setActivePage] = useState("dashboard");

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      setData(null);

    const response = await getRecruiterDashboard();

console.log("LOCAL STORAGE USER:",
  JSON.parse(localStorage.getItem("user"))
);

console.log("DASHBOARD API RESPONSE:", response);

setData(response);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
   <div>
  <h1 className="text-3xl font-bold text-gray-800">
    Recruiter Dashboard
  </h1>

  <p className="text-gray-500 mt-2">
    Welcome to your recruiter dashboard.
  </p>

  <Link
    to="/"
    className="inline-flex items-center gap-2 mt-4 text-blue-700 font-medium hover:text-blue-900 transition-colors"
  >
    <ArrowLeft size={18} />
    <span>Back to Home</span>
  </Link>

  {loading ? (
    <p className="mt-6">Loading dashboard...</p>
  ) : error ? (
    <p className="text-red-500 mt-6">{error}</p>
  ) : (
    <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
      <h2 className="font-semibold text-lg">
        Dashboard Overview
      </h2>

      <p className="text-gray-500 mt-2">
        Your recruiter account is ready.
      </p>
    </div>
  )}
</div>
        );

      case "profile":
        return <CompanyProfile />;

      case "create-job":
        return <CreateJob />;

      case "jobs":
        return < PublishedJobs/>;

      case "applicants":
        return <Applicants />;

      default:
        return <CompanyProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        {renderContent()}
      </main>

    </div>
  );
}

export default Recruiter;
