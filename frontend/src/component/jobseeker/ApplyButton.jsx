

import React, { useEffect, useState } from "react";
import { api,applyForJob } from "../../services/api";
import axios from "axios";

function ApplyButton({ jobId, jobSeeker }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
 const [resumeUrl, setResumeUrl] = useState("");

console.log("resumeUrl:",resumeUrl);

  const handleApply = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await applyForJob(jobId, coverLetter);

      setMessage(
        res.message || "Application submitted successfully!"
      );
      setSuccess(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Application failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (loading) return;

    setIsOpen(false);

    if (!success) {
      setMessage("");
    }
  };   

useEffect(() => {
 
    const fetchResume = async () => {

        if (!jobSeeker?.resume) {
            console.log("Resume not available yet");
            return;
        }

        try {
    const res = await api.get(`/resume/${jobSeeker.resume}`);
    setResumeUrl(res.data.resumeUrl);

        } catch (error) {
            console.error("Resume fetch error:", error);
        }
    };

    fetchResume();

}, [jobSeeker?.resume]);

  return (
    <>
      {/* Apply Now Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
      >
        Apply Now
        <span className="text-lg">→</span>
      </button>

      {/* Application Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-modal-title"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2
                  id="apply-modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Apply for this Job
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review your details before applying
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Jobseeker Details */}
              <div>
                <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-700">
  {jobSeeker?.profileImage ? (
    <img
      src={jobSeeker.profileImage}
      alt={jobSeeker?.name || "Profile"}
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    jobSeeker?.name?.charAt(0)?.toUpperCase() || "U"
  )}
</div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {jobSeeker?.name || "Your Name"}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Job Seeker
                    </p>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Email Address
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-gray-800">
                      {jobSeeker?.email || "Email not available"}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Phone Number
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {jobSeeker?.phone || "Phone number not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  Your Resume
                </p>

                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6M8 13h8M8 17h8" />
                        </svg>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          View Resume
                        </p>

                        <p className="text-xs text-gray-500">
                          Open your uploaded resume
                        </p>
                      </div>
                    </div>

                    <span className="text-lg text-blue-600">↗</span>
                  </a>
                ) : (
                  <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                    No resume uploaded. Add your resume to your profile before applying.
                  </p>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label
                  htmlFor="application-cover-letter"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Cover Letter{" "}
                  <span className="font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="application-cover-letter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  maxLength={2000}
                  disabled={loading || success}
                  placeholder="Write a short message to the employer..."
                  className="min-h-28 w-full resize-y rounded-xl border border-gray-200 p-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {coverLetter.length}/2000
                </p>
              </div>

              {/* Status Message */}
              {message && (
                <div
                  role="status"
                  className={`rounded-lg p-3 text-sm ${
                    success
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={loading || success || !jobSeeker}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Applying...
                    </>
                  ) : success ? (
                    "Application Submitted"
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ApplyButton;
