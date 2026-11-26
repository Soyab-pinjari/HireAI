
import { Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Registration from "./pages/public/Registration";

import ProtectedRoute from "./component/comman/ProtectedRoute";

import Jobseeker from "./pages/Dashboard/Jobseeker";
import Recruiter from "./pages/Dashboard/Recruiter";
import Admin from "./pages/Dashboard/Admin";
import Layout from "./Layout";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./Redux/authSlice";
import JobPage from "./pages/public/JobPage";
import EditJob from "./pages/EditJob";

function App() {
const dispatch = useDispatch();

useEffect(() => {
  dispatch(checkAuth());
}, [dispatch]);
  return (
    <Routes>
     <Route path="/edit-job/:id" element={<EditJob />} />
      <Route path="/" element={<Layout />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Registration />} />
<Route path="/jobs/:jobId" element={<JobPage />} />
      <Route
        path="/jobseeker/dashboard"
        element={
          <ProtectedRoute allowedRoles={["jobseeker"]}>
            <Jobseeker />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <Recruiter />
            
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<h2>404 - Page Not Found</h2>}
      />

    </Routes>
  );
}

export default App;
