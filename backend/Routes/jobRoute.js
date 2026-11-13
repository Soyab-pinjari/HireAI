
const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByCompany,
  getMyCompanyJobs,
} = require("../Controller/JobController");
const { authenticate, authorize } = require("../Middleware/auth");

router.post("/create", createJob);


router.get("/all", getAllJobs);

// router.get("/company/:companyId", getJobsByCompany);
router.get("/company-jobs",authenticate,authorize("recruiter"),getMyCompanyJobs);
router.get("/:id", getJobById);

router.put("/update/:id", updateJob);


router.delete("/delete/:id", deleteJob);

module.exports = router;
