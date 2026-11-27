const User = require("../Modal/User");

const cloudinary = require("../Config/cloudinary");
const uploadImage = require("../Utills/uploadImage");
const Resume = require("../Modal/Resume");
const Job  = require("../Modal/Job");
const Application = require("../Modal/Application")
const uploadResumeFile = require("../Utills/uploadResume");

const getJobseekerDashboard = async (req, res) => {
  try {
    const applicantId = req.user?._id;

    if (!applicantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Fetch all applications of logged-in jobseeker
    const applications = await Application.find({
      applicant: applicantId,
    })
      .populate({
        path: "job",
        select:
          "jobTitle type experience salary vacancies address skills createdAt company",
      })
      .populate({
        path: "resume",
        select: "fileName fileUrl",
      })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate application statistics and fetch latest jobs
    const [
      totalApplications,
      pending,
      reviewed,
      shortlisted,
      rejected,
      accepted,
      latestJobs,
    ] = await Promise.all([
      Application.countDocuments({ applicant: applicantId }),

      Application.countDocuments({
        applicant: applicantId,
        status: "pending",
      }),

      Application.countDocuments({
        applicant: applicantId,
        status: "reviewed",
      }),

      Application.countDocuments({
        applicant: applicantId,
        status: "shortlisted",
      }),

      Application.countDocuments({
        applicant: applicantId,
        status: "rejected",
      }),

      Application.countDocuments({
        applicant: applicantId,
        status: "accepted",
      }),

      Job.find()
        .select(
          "jobTitle type experience salary vacancies address skills createdAt company"
        )
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    // Send dashboard data
    return res.status(200).json({
      success: true,
      message: "Jobseeker dashboard data fetched successfully",

      stats: {
        totalApplications,
        pending,
        reviewed,
        shortlisted,
        rejected,
        accepted,
      },

      recentApplications: applications.slice(0, 5),

      applications,

      latestJobs,
    });
  } catch (error) {
    console.error("Jobseeker dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load jobseeker dashboard",
      error: error.message,
    });
  }
};





const getRecruiterDashboard = async (req, res) => {
  try {
    // Assumes auth middleware attaches the logged-in user's company ID
    const companyId = req.user.company;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID not found",
      });
    }

    // Find jobs posted by this company
    const jobs = await Job.find({ company: companyId })
      .select("_id jobTitle type address salary vacancies  createdAt")
      .sort({ createdAt: -1 });

    const jobIds = jobs.map((job) => job._id);

    // Count applications for this company's jobs
    const [
      totalApplicants,
      pending,
      reviewed,
      shortlisted,
      rejected,
      accepted,
      recentApplicants,
    ] = await Promise.all([
      Application.countDocuments({ job: { $in: jobIds } }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "pending",
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "reviewed",
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "shortlisted",
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "rejected",
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "accepted",
      }),
      Application.find({ job: { $in: jobIds } })
        .populate("applicant", "name email profileImage")
        .populate("job", "jobTitle")
        .populate("resume")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs: jobs.length,
        totalApplicants,
        pending,
        reviewed,
        shortlisted,
        rejected,
        accepted,
      },
      recentApplicants,
      jobs,
    });
  } catch (error) {
    console.error("Recruiter dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load recruiter dashboard",
    });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id)
      .select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    const totalUsers = await User.countDocuments();

    const totalJobseekers = await User.countDocuments({
      role: "jobseeker"
    });

    const totalRecruiters = await User.countDocuments({
      role: "recruiter"
    });

    res.status(200).json({
      success: true,
      message: "Admin dashboard data",
      admin,
      stats: {
        totalUsers,
        totalJobseekers,
        totalRecruiters
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getProfile = async (req, res) => {
    try {

        const user = await User.findOne({
            _id: req.user.id,
            role: "jobseeker"
        })
        .select("-password")
        .populate("resume");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateProfile = async (req, res) => {

  console.log("update controller hit")
    try {
        const userId = req.user.id;
      console.log("UPDATE PROFILE CONTROLLER HIT");
        console.log("USER:", req.user);
        console.log("BODY:", req.body);

        const {
            name,
            phone,
            location,
            bio,
            skills,
            experience,
            education,
            profileImage
        } = req.body;

        const user = await User.findOneAndUpdate(
            {
                _id: userId,
                role: "jobseeker"
            },
            {
                $set: {
                    name,
                    phone,
                    location,
                    bio,
                    skills,
                    experience,
                    education,
                    profileImage
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "JobSeeker not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.log("UPDATE PROFILE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image"
            });
        }

        const result = await uploadImage(
            req.file.buffer,
            "jobseeker-profiles"
        );

        const user = await User.findOneAndUpdate(
            {
                _id: userId,
                role: "jobseeker"
            },
            {
                $set: {
                    profileImage: result.secure_url
                }
            },
            {
                new: true
            }
        ).select("-password");

        if (!user) {
            await cloudinary.uploader.destroy(result.public_id);

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            profileImage: user.profileImage
        });

    } catch (error) {
        console.log("IMAGE UPLOAD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const uploadJobSeekerResume = async (req, res) => {

    let uploadedFile = null;

    try {

        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a PDF resume"
            });
        }

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

        // Upload PDF to Cloudinary
        uploadedFile = await uploadResumeFile(
            req.file.buffer,
            "jobseeker-resumes",
            req.file.originalname
        );

        // Create Resume document
        const resume = await Resume.create({
            user: userId,
            fileUrl: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            originalName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size
        });

        // Update User resume reference
        const oldResumeId = user.resume;

        user.resume = resume._id;
        await user.save();

        // Delete old resume after successful replacement
        if (oldResumeId) {

            const oldResume = await Resume.findById(oldResumeId);

            if (oldResume) {
                await cloudinary.uploader.destroy(
                    oldResume.publicId,
                    { resource_type: "raw" }
                );

                await Resume.findByIdAndDelete(oldResumeId);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume
        });

    } catch (error) {

        console.log("RESUME CONTROLLER ERROR:", error);

        // Cleanup newly uploaded file if database operation fails
        if (uploadedFile) {
            await cloudinary.uploader.destroy(
                uploadedFile.public_id,
                { resource_type: "raw" }
            ).catch(console.error);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



module.exports ={uploadJobSeekerResume,getJobseekerDashboard,getAdminDashboard,getRecruiterDashboard,updateProfile,getProfile,uploadProfileImage}