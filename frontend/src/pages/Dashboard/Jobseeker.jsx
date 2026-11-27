
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobseekerDashboard } from "../../services/api";
import Sidebar from "../../component/jobseeker/sidebar";
import Profile from "../../component/jobseeker/Profile";

import SavedJobs from "../../component/jobseeker/SavedJobs";
import { Link } from "react-router-dom";

import {ArrowLeft} from 'lucide-react'
import MyApplications from "../../component/jobseeker/MyApplications";
import JobseekerDashboard from "../../component/jobseeker/jobseekerDashboard";
import ResumeAnalyzer from "../../component/jobseeker/ResumeAnalyzer";
function Jobseeker() {
  const [activePage, setActivePage] = useState("dashboard");
   console.log("Jobseeker component rendered");
  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log("User:", user);
        console.log("Role:", user?.role);

        const response = await getJobseekerDashboard();

        console.log("Jobseeker Dashboard:", response);

        setData(response);

      } catch (err) {
        console.log("Dashboard Error:", err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Dashboard failed"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <h2>Loading Jobseeker Dashboard...</h2>;

  if (error) return <h2>{error}</h2>;
 const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
   <div>
 
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
<JobseekerDashboard/>
    // <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
    //   <h2 className="font-semibold text-lg">
    //     Dashboard Overview
    //   </h2>

    //   <p className="text-gray-500 mt-2">
    //     Your Jobseeker account is ready.
    //   </p>
    // </div>
  )}
</div>
        );

      case "profile":
        return <Profile />;

      case "applied-jobs":
        return <MyApplications/>;

      case "saved-jobs":
        return <SavedJobs/>;

      // case "applicants":
      //   return <Applicants />;
        case "resume-analyzer":
    return <ResumeAnalyzer />;
      default:
        return <Profile />;
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

export default Jobseeker;
