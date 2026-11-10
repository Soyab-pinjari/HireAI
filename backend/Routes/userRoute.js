const express = require("express");
const { authenticate, authorize } = require("../Middleware/auth");
const { getJobseekerDashboard, getRecruiterDashboard, getAdminDashboard } = require("../Controller/UserController");

const router = express.Router();

router.get('/jobseeker/dashboard',authenticate,authorize("jobseeker"),getJobseekerDashboard);
router.get('/recruiter/dashboard',authenticate,authorize("recruiter"),getRecruiterDashboard);
router.get('/admin/dashboard',authenticate,authorize("admin"),getAdminDashboard);
module.exports=router
