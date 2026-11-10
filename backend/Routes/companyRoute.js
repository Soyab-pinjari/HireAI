
const express = require("express");
const router = express.Router();

const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../Controller/CompanyController");

router.post("/create", createCompany);
router.get("/all", getAllCompanies);
router.get("/:id", getCompanyById);
router.put("/update/:id", updateCompany);
router.delete("/delete/:id", deleteCompany);

module.exports = router;
