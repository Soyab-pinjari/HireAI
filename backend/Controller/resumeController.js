
const Resume = require("../Modal/Resume")
const getResumeById = async (req, res) => {
    console.log("get resume hit")
  try {
  
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // `fileUrl` ko apne Resume model ke actual URL field se replace karo
    return res.status(200).json({
      success: true,
      resumeUrl: resume.fileUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
};

module.exports = getResumeById;