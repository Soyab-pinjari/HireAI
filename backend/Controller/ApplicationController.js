const Application = require("../Modal/Application");
const Job = require("../Modal/Job");
const User = require("../Modal/User");

const applyJob = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;
        const userId = req.user.id;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        // Check job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check applicant
        const user = await User.findOne({
            _id: userId,
            role: "jobseeker"
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "JobSeeker not found"
            });
        }

        // Check duplicate application
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            applicant: userId,
            resume: user.resume,
            coverLetter: coverLetter || ""
        });

        return res.status(201).json({
            success: true,
            message: "Job applied successfully",
            application
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        console.log("APPLY JOB ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { applyJob };