const Application = require("../Modal/Application");
const Company = require("../Modal/Company");
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

const getUserApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            applicant: req.user.id
        })
        .populate({
            path: "job",
            select: "jobTitle type salary address experience"
        })
        .populate({
            path: "applicant",
            select: "name email"
        })
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        console.log("MY APPLICATIONS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get applicants for recruiter's jobs
const getRecruiterApplicants = async (req, res) => {
    try {

        // Get logged-in recruiter
        const recruiter = await User.findById(req.user.id)
            .select("company");

        if (!recruiter || !recruiter.company) {
            return res.status(404).json({
                success: false,
                message: "Recruiter company not found"
            });
        }

        // Find jobs belonging to recruiter's company
        const jobs = await Job.find({
            company: recruiter.company
        }).select("_id jobTitle");

        const jobIds = jobs.map(job => job._id);

        if (jobIds.length === 0) {
            return res.status(200).json({
                success: true,
                totalApplicants: 0,
                applications: []
            });
        }

        // Find applications for these jobs
        const applications = await Application.find({
            job: { $in: jobIds }
        })
        .populate({
            path: "job",
            select: "jobTitle type salary address company"
        })
        .populate({
            path: "applicant",
            select: "name email profileImage phone location skills experience education resume"
        })
        .populate({
            path: "applicant",
            populate: {
                path: "resume",
                select: "fileUrl fileName"
            }
        })
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalApplicants: applications.length,
            applications
        });

    } catch (error) {

        console.log("RECRUITER APPLICANTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {

        const { applicationId } = req.params;
        const { status } = req.body;

        const allowedStatus = [
            "pending",
            "reviewed",
            "shortlisted",
            "accepted",
            "rejected"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const recruiter = await User.findById(req.user.id)
            .select("company");

        if (!recruiter?.company) {
            return res.status(404).json({
                success: false,
                message: "Recruiter company not found"
            });
        }

        const application = await Application.findById(applicationId)
            .populate("job");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (
            String(application.job.company) !==
            String(recruiter.company)
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        application.status = status;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Application status updated",
            application
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = { applyJob ,getUserApplications,getRecruiterApplicants,updateApplicationStatus};