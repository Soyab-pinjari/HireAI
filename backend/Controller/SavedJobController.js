const SavedJob = require("../Modal/SavedJob");
const Job = require("../Modal/Job");

// Save Job
const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const existing = await SavedJob.findOne({
            user: userId,
            job: jobId
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Job already saved"
            });
        }

        const savedJob = await SavedJob.create({
            user: userId,
            job: jobId
        });

        return res.status(201).json({
            success: true,
            message: "Job saved successfully",
            savedJob
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Job already saved"
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Saved Jobs
const getSavedJobs = async (req, res) => {
    try {

        const savedJobs = await SavedJob.find({
            user: req.user.id
        })
        .populate({
            path: "job",
            select: "jobTitle type salary address experience skills vacancies"
        })
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            savedJobs
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Remove Saved Job
const removeSavedJob = async (req, res) => {
    try {

        const deleted = await SavedJob.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Saved job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job removed from saved jobs"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob
};