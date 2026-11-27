
import React, { useEffect, useState } from "react";

import {
    BrainCircuit,
    Sparkles,
    FileText,
    Loader2,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    Award,
    Lightbulb,
} from "lucide-react";

import {
    analyzeMyResumeApi,
    getResumeAnalysisHistoryApi,
} from "../../services/api";

function ResumeAnalyzer() {

    const [analysis, setAnalysis] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    // Fetch previous analysis
    const fetchHistory = async () => {
        try {
            const response =
                await getResumeAnalysisHistoryApi();

            const records = response.analyses || [];

            setHistory(records);

            if (records.length > 0) {
                setAnalysis(records[0]);
            }
        } catch (err) {
            console.error("History error:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Analyze existing uploaded resume
    const handleAnalyze = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await analyzeMyResumeApi();

            setAnalysis(response.analysis);

            await fetchHistory();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Resume analysis failed"
            );
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-10 text-center">
                Loading resume analysis...
            </div>
        );
    }

    return (
        <div className="space-y-7">

            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                        <BrainCircuit
                            className="text-indigo-600"
                            size={27}
                        />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            AI Resume Analyzer
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Improve your resume with AI-powered insights.
                        </p>
                    </div>
                </div>
            </div>

            {/* Analyze Card */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">

                <div className="flex items-center gap-3 mb-5">
                    <FileText className="text-indigo-600" />

                    <div>
                        <h2 className="font-bold text-gray-800">
                            Your Uploaded Resume
                        </h2>

                        <p className="text-xs text-gray-500">
                            AI will analyze your existing uploaded PDF.
                        </p>
                    </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-5 flex items-center gap-3">
                    <BrainCircuit
                        size={30}
                        className="text-indigo-600"
                    />

                    <div className="flex-1">
                        <p className="font-semibold text-indigo-900">
                            Ready for AI Analysis
                        </p>

                        <p className="text-xs text-indigo-700 mt-1">
                            No need to upload your resume again.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg flex gap-2 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Analyzing Resume...
                        </>
                    ) : (
                        <>
                            <Sparkles size={19} />
                            {analysis
                                ? "Re-analyze Resume"
                                : "Analyze My Resume"}
                        </>
                    )}
                </button>
            </div>

            {/* Analysis Results */}
            {analysis && (
                <>
                    {/* Score */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">
                                    Resume Score
                                </p>

                                <h2 className="text-5xl font-bold text-indigo-600 mt-2">
                                    {analysis.score}
                                    <span className="text-xl text-gray-400">
                                        /100
                                    </span>
                                </h2>
                            </div>

                            <Award
                                size={55}
                                className="text-indigo-500"
                            />
                        </div>

                        <div className="w-full bg-gray-100 h-3 rounded-full mt-5 overflow-hidden">
                            <div
                                className="bg-indigo-600 h-full rounded-full"
                                style={{
                                    width: `${analysis.score}%`,
                                }}
                            />
                        </div>

                        <p className="text-gray-600 mt-5 text-sm">
                            {analysis.summary}
                        </p>

                    </div>

                    {/* Skills */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">

                        <h2 className="font-bold text-gray-800 mb-4">
                            Skills Identified
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {(analysis.skills || []).map(
                                (skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                )
                            )}
                        </div>

                    </div>

                    {/* Experience and Education */}
                    <div className="grid md:grid-cols-2 gap-5">

                        <div className="bg-white border rounded-2xl p-6">
                            <h2 className="font-bold mb-3">
                                Experience
                            </h2>

                            <p className="text-sm text-gray-600">
                                {analysis.experience || "Not available"}
                            </p>
                        </div>

                        <div className="bg-white border rounded-2xl p-6">
                            <h2 className="font-bold mb-3">
                                Education
                            </h2>

                            <ul className="space-y-2 text-sm text-gray-600">
                                {(analysis.education || []).map(
                                    (item, index) => (
                                        <li key={index}>
                                            • {item}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                    </div>

                    {/* Strengths */}
                    <div className="bg-white border rounded-2xl p-6">
                        <h2 className="font-bold text-green-700 mb-4 flex gap-2 items-center">
                            <CheckCircle size={20} />
                            Resume Strengths
                        </h2>

                        <ul className="space-y-3">
                            {(analysis.strengths || []).map(
                                (item, index) => (
                                    <li
                                        key={index}
                                        className="bg-green-50 p-3 rounded-lg text-sm text-gray-700"
                                    >
                                        {item}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-white border rounded-2xl p-6">
                        <h2 className="font-bold text-red-600 mb-4">
                            Areas to Improve
                        </h2>

                        <ul className="space-y-3">
                            {(analysis.weaknesses || []).map(
                                (item, index) => (
                                    <li
                                        key={index}
                                        className="bg-red-50 p-3 rounded-lg text-sm text-gray-700"
                                    >
                                        {item}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-white border rounded-2xl p-6">
                        <h2 className="font-bold text-indigo-700 mb-4 flex items-center gap-2">
                            <Lightbulb size={20} />
                            AI Improvement Suggestions
                        </h2>

                        <ul className="space-y-3">
                            {(analysis.suggestions || []).map(
                                (item, index) => (
                                    <li
                                        key={index}
                                        className="bg-indigo-50 p-3 rounded-lg text-sm text-gray-700"
                                    >
                                        {item}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <p className="text-xs text-gray-400">
                        AI-generated feedback may contain errors.
                        Verify all resume details independently.
                    </p>
                </>
            )}

            {/* Previous Analysis */}
            {history.length > 0 && (
                <div className="bg-white border rounded-2xl p-6">
                    <h2 className="font-bold text-gray-800 mb-4">
                        Previous Analysis
                    </h2>

                    <div className="space-y-3">
                        {history.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between border rounded-lg p-4"
                            >
                                <div>
                                    <p className="font-medium text-sm">
                                        {item.fileName}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setAnalysis(item)}
                                    className="text-indigo-600 text-sm font-semibold"
                                >
                                    Score: {item.score}/100
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

export default ResumeAnalyzer;
