
import { useEffect, useState } from "react";
import { getRecruiterDashboard } from "../../services/api";
import CompanyProfile from "../../component/recruiter/CompanyProfile";



function Recruiter() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log("Recruiter API calling...");

        const response = await getRecruiterDashboard();

        console.log("Recruiter API response:", response);

        setData(response);

      } catch (error) {
        console.log("Recruiter API error:", error);

        setError(
          error.response?.data?.message ||
          error.message ||
          "Something went wrong"
        );

      } finally {
        console.log("Recruiter API completed");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // if (loading) {
  //   return <h2>Loading Recruiter Dashboard...</h2>;
  // }

  if (error) {
    return <h2 className="text-red-500">{error}</h2>;
  }

  return (
    <div>
      <h1>Recruiter Dashboard</h1>
{/* 
      <pre>{JSON.stringify(data, null, 2)}</pre>
       */}
     <CompanyProfile/>
    </div>
  );
}

export default Recruiter;
