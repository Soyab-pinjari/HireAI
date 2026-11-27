import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/api";

function MyApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchApplications = async () => {
            try {
                const res = await getMyApplications();

                setApplications(res.applications || []);

            } catch (error) {
                console.log(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load applications"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchApplications();

    }, []);

    const getStatusStyle = (status) => {

        const styles = {
            pending: "bg-yellow-100 text-yellow-700",
            reviewed: "bg-blue-100 text-blue-700",
            shortlisted: "bg-purple-100 text-purple-700",
            rejected: "bg-red-100 text-red-700",
            accepted: "bg-green-100 text-green-700"
        };

        return styles[status] || "bg-gray-100 text-gray-700";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading applications...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        My Applications
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Track and manage all your job applications.
                    </p>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white border rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Total Applied
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {applications.length}
                        </h2>
                    </div>

                    <div className="bg-white border rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Pending
                        </p>

                        <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                            {applications.filter(a => a.status === "pending").length}
                        </h2>
                    </div>

                    <div className="bg-white border rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Shortlisted
                        </p>

                        <h2 className="text-3xl font-bold text-purple-600 mt-2">
                            {applications.filter(a => a.status === "shortlisted").length}
                        </h2>
                    </div>

                    <div className="bg-white border rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Accepted
                        </p>

                        <h2 className="text-3xl font-bold text-green-600 mt-2">
                            {applications.filter(a => a.status === "accepted").length}
                        </h2>
                    </div>

                </div>

                {/* Applications */}
                {error ? (

                    <div className="bg-white border rounded-xl p-8 text-center text-red-500">
                        {error}
                    </div>

                ) : applications.length === 0 ? (

                    <div className="bg-white border rounded-2xl p-12 text-center">

                        <div className="text-5xl mb-4">
                            📄
                        </div>

                        <h2 className="text-xl font-bold text-gray-800">
                            No Applications Yet
                        </h2>

                        <p className="text-gray-500 mt-2 mb-6">
                            You haven't applied for any jobs yet.
                            Start exploring opportunities!
                        </p>

                        <Link
                            to="/jobs"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Explore Jobs
                        </Link>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {applications.map((application) => {

                            const job = application.job;

                            if (!job) return null;

                            return (

                                <div
                                    key={application._id}
                                    className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                                >

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                                        <div className="flex-1">

                                            <h2 className="text-xl font-bold text-gray-900">
                                                {job.jobTitle}
                                            </h2>

                                            <p className="text-gray-500 mt-2">
                                                {job.address}
                                            </p>

                                            <div className="flex flex-wrap gap-3 mt-4">

                                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                    {job.type}
                                                </span>

                                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                                                    ₹{Number(job.salary).toLocaleString("en-IN")}
                                                </span>

                                                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                                                    {job.experience} Years Experience
                                                </span>

                                            </div>

                                            <p className="text-sm text-gray-400 mt-4">
                                                Applied on:{" "}
                                                {new Date(application.createdAt).toLocaleDateString("en-IN")}
                                            </p>

                                        </div>

                                        <div className="flex flex-col items-start md:items-end gap-4">

                                            <span
                                                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusStyle(application.status)}`}
                                            >
                                                {application.status}
                                            </span>

                                            <Link
                                                to={`/jobs/${job._id}`}
                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                            >
                                                View Job →
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
}

export default MyApplications;