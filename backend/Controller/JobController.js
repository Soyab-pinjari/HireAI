
const Job = require("../Modal/Job");
const Company = require("../Modal/Company");
const User = require("../Modal/User");
const { default: mongoose } = require("mongoose");

const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      type,
      experience,
      salary,
      vacancies,
      address,
      skills,
      description,
    } = req.body;

    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create jobs",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user || !user.company) {
      return res.status(404).json({
        success: false,
        message: "Recruiter company not found",
      });
    }

    if (
      !jobTitle ||
      !type ||
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

    const company = await Company.findById(user.company);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const job = await Job.create({
      jobTitle,
      type,
      company: company._id,
      experience,
      salary,
      vacancies,
      address,
      skills,
      description,
    });
    company.jobs.push(job._id);
    await company.save();

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });

  } catch (error) {
    console.error("Create Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyCompanyJobs = async (req, res) => {
  try {
 
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access their jobs",
      });
    }

    const user = await User.findById(req.user.id)
      .select("company");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    // 3. Check company
    if (!user.company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
        jobs: [],
        totalJobs: 0,
      });
    }

    // 4. Find company
    const company = await Company.findById(user.company)
      .select("companyName profileImage");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
        jobs: [],
        totalJobs: 0,
      });
    }

    const jobs = await Job.find({
      company: user.company,
    })
      .populate({
        path: "company",
        select: "companyName profileImage",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Company jobs fetched successfully",
      company: company.companyName,
      companyId: company._id,
      totalJobs: jobs.length,
      jobs,
    });

  } catch (error) {
    console.error("Get My Company Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch company jobs",
      error: error.message,
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

const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(jobId)
      .populate({
        path: "company",
        select: "-__v -updatedAt",
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!job.company) {
      return res.status(404).json({
        success: false,
        message: "Company details not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Job details fetched successfully",

      job: {
        _id: job._id,
        jobTitle: job.jobTitle,
        type: job.type,
        experience: job.experience,
        salary: job.salary,
        vacancies: job.vacancies,
        address: job.address,
        skills: job.skills,
        description: job.description,
        createdAt: job.createdAt,
      },

      company: job.company,
    });

  } catch (error) {
    console.error("Get Job Details Error:", error);

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
      await Company.findByIdAndUpdate(job.company, {
        $pull: { jobs: job._id },
      });

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
  getJobDetails,
  updateJob,
  deleteJob,
  getJobsByCompany,
  getMyCompanyJobs,
};
