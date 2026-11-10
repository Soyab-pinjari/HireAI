const User = require("../Modal/User");
const getJobseekerDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Jobseeker not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Jobseeker dashboard data",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// RECRUITER DASHBOARD
const getRecruiterDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Recruiter dashboard data",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ADMIN DASHBOARD
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


module.exports ={getJobseekerDashboard,getAdminDashboard,getRecruiterDashboard}