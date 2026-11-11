
const express = require("express");
const router = express.Router();

const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../Controller/CompanyController");
const upload = require("../Middleware/upload");
const { authenticate, authorize } = require("../Middleware/auth");

router.post(
  "/create",
  authenticate,
  authorize("recruiter"),
  upload.single("profileImage"),
  createCompany
);
router.get("/all", getAllCompanies);
router.get("/:id", getCompanyById);
router.put(
  "/update/:id",
  authenticate,
  authorize("recruiter"),
  upload.single("profileImage"),
  updateCompany
);
router.delete("/delete/:id", deleteCompany);

module.exports = router;
