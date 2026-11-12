
import { useEffect, useState } from "react";

import { getRecruiterDashboard } from "../../services/api";

import CompanyProfile from "../../component/recruiter/CompanyProfile";
import Sidebar from "../../component/recruiter/Sidebar";
import CreateJob from "../CreateJob";
import AllJobs from "../AllJobs";

import Applicants from "../../component/recruiter/Applicants";
function Recruiter() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getRecruiterDashboard();
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
        return <AllJobs />;

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
