
const Job = require("../Modal/Job");
const Company = require("../Modal/Company");

const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      type,
      company,
      experience,
      salary,
      vacancies,
      address,
      skills,
      description,
    } = req.body;

    if (
      !jobTitle ||
      !type ||
      !company ||
      salary === undefined ||
      !address ||
      !description ||
      skills === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!require("mongoose").isValidObjectId(company)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const companyExists = await Company.findById(company);

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

  
    const job = await Job.create({
      jobTitle,
      type,
      company,
      experience,
      salary,
      vacancies,
      address,
      skills,
      description,
    });

    await Company.findByIdAndUpdate(company, {
      $addToSet: { jobs: job._id },
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "companyName companyEmail profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!require("mongoose").isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id)
      .populate("company", "companyName companyEmail profileImage industry");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!require("mongoose").isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const allowedFields = [
      "jobTitle",
      "type",
      "company",
      "experience",
      "salary",
      "vacancies",
      "address",
      "skills",
      "description",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    // If company is changed
    if (
      updateData.company &&
      updateData.company.toString() !== job.company.toString()
    ) {
      if (!require("mongoose").isValidObjectId(updateData.company)) {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID",
        });
      }

      const companyExists = await Company.findById(updateData.company);

      if (!companyExists) {
        return res.status(404).json({
          success: false,
          message: "New company not found",
        });
      }

      // Remove job from old company
      await Company.findByIdAndUpdate(job.company, {
        $pull: { jobs: job._id },
      });

      // Add job to new company
      await Company.findByIdAndUpdate(updateData.company, {
        $addToSet: { jobs: job._id },
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("company", "companyName companyEmail");

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!require("mongoose").isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await Company.findByIdAndUpdate(job.company, {
      $pull: { jobs: job._id },
    });

    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getJobsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!require("mongoose").isValidObjectId(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const jobs = await Job.find({ company: companyId })
      .populate("company", "companyName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByCompany,
};
