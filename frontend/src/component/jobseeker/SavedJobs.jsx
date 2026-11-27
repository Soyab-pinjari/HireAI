import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getSavedJobsApi,
    removeSavedJobApi
} from "../../services/api";

function SavedJobs() {

    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);

            const res = await getSavedJobsApi();

            setSavedJobs(res.savedJobs || []);

        } catch (error) {
            console.log("SAVED JOB ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load saved jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const handleRemove = async (id) => {
        try {
            setRemovingId(id);

            await removeSavedJobApi(id);

            setSavedJobs(prev =>
                prev.filter(item => item._id !== id)
            );

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to remove saved job"
            );
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <p className="text-gray-500">Loading saved jobs...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                            ❤️
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Saved Jobs
                            </h1>

                            <p className="text-gray-500 text-sm mt-1">
                                Your favourite job opportunities in one place.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 bg-white border rounded-xl p-5">
                        <p className="text-gray-500 text-sm">
                            Total Saved Jobs
                        </p>

                        <h2 className="text-3xl font-bold text-blue-600 mt-1">
                            {savedJobs.length}
                        </h2>
                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-5">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!error && savedJobs.length === 0 ? (

                    <div className="bg-white border rounded-2xl p-12 text-center">

                        <div className="text-6xl mb-5">
                            💼
                        </div>

                        <h2 className="text-xl font-bold text-gray-800">
                            No Saved Jobs Yet
                        </h2>

                        <p className="text-gray-500 mt-2 mb-6">
                            Save jobs that interest you and come back to them anytime.
                        </p>

                        <Link
                            to="/jobs"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                        >
                            Explore Jobs →
                        </Link>

                    </div>

                ) : (

                    /* Saved Jobs List */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {savedJobs.map((item) => {

                            const job = item.job;

                            if (!job) return null;

                            return (

                                <div
                                    key={item._id}
                                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                                >

                                    <div className="flex justify-between items-start gap-3">

                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {job.jobTitle}
                                            </h2>

                                            <p className="text-gray-500 text-sm mt-2">
                                                📍 {job.address}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(item._id)}
                                            disabled={removingId === item._id}
                                            title="Remove saved job"
                                            className="w-10 h-10 flex-shrink-0 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition disabled:opacity-50"
                                        >
                                            {removingId === item._id
                                                ? "..."
                                                : "❤️"
                                            }
                                        </button>

                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-5">

                                        <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                                            {job.type}
                                        </span>

                                        <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                                            {job.experience} Years Experience
                                        </span>

                                    </div>

                                    <div className="mt-5 flex justify-between items-center border-t pt-4">

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Salary
                                            </p>

                                            <p className="text-lg font-bold text-green-600">
                                                ₹{Number(job.salary).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                                        >
                                            View Job →
                                        </Link>

                                    </div>

                                    <p className="text-xs text-gray-400 mt-4">
                                        Saved on:{" "}
                                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                                    </p>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
}

export default SavedJobs;

