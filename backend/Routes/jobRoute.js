
const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
getJobDetails,
  updateJob,
  deleteJob,
  getJobsByCompany,
  getMyCompanyJobs,
} = require("../Controller/JobController");
const { authenticate, authorize } = require("../Middleware/auth");

router.post("/create", authenticate,authorize("recruiter"),createJob);

router.get("/company-jobs",authenticate,authorize("recruiter"),getMyCompanyJobs);
router.get("/all", getAllJobs);

router.get("/job-details/:jobId", getJobDetails);

// router.get("/company/:companyId", getJobsByCompany);


router.put("/update/:id", updateJob);


router.delete("/delete/:id", deleteJob);

module.exports = router;
