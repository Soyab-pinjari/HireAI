
const express = require("express");
const router = express.Router();

const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getMyCompany,
} = require("../Controller/CompanyController");
const upload = require("../Middleware/upload");
const { authenticate, authorize } = require("../Middleware/auth");
const { getMyCompanyJobs } = require("../Controller/JobController");

router.post(
  "/create",
  authenticate,
  authorize("recruiter"),
  upload.single("profileImage"),
  createCompany
);

router.get("/my-company",authenticate,
  authorize("recruiter"), getMyCompany);

  router.get("/all", getAllCompanies);
  router.get("/:id", getCompanyById);

router.get("/company-jobs",authenticate,
  authorize("recruiter"),getMyCompanyJobs)
  
router.put(
  "/update/:id",
  authenticate,
  authorize("recruiter"),
  upload.single("profileImage"),
  updateCompany
);

router.delete("/delete/:id", deleteCompany);

module.exports = router;
