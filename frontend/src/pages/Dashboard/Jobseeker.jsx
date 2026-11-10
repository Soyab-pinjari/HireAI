
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getJobseekerDashboard } from "../../services/api";

function Jobseeker() {
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

  return (
    <div>
      <h1>Jobseeker Dashboard</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Jobseeker;
