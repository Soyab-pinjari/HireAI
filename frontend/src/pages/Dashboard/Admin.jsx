import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../services/api";

function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getAdminDashboard();
        setData(response);
      } catch (error) {
        setError(
          error.response?.data?.message || "Dashboard not found"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
   if (loading) return <h2>Loading Admin Dashboard...</h2>;
  if (error) return <h2>{error}</h2>;
  return (
    <div>
       <h1>Admin Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default Admin
