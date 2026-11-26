const express = require("express");
const { authenticate, authorize } = require("../Middleware/auth");
const { getJobseekerDashboard, getRecruiterDashboard, getAdminDashboard, updateProfile, getProfile, uploadProfileImage, uploadJobSeekerResume } = require("../Controller/UserController");
const upload = require("../Middleware/upload");
const resumeUpload = require("../Middleware/resumeUpload");
const router = express.Router();

router.get('/jobseeker/dashboard',authenticate,authorize("jobseeker"),getJobseekerDashboard);
router.put(
    "/jobseeker/profile",
    (req, res, next) => {
        console.log("PUT ROUTE HIT");
        next();
    },
    authenticate,
    authorize("jobseeker"),
    updateProfile
);
router.post(
    "/jobseeker/profile/image",
    authenticate,
    authorize("jobseeker"),
    upload.single("profileImage"),
    uploadProfileImage
);
router.get(
    "/jobseeker/profile",
    authenticate,
    authorize("jobseeker"),
    getProfile
);
router.post(
    "/jobseeker/profile/resume",
    authenticate,
    authorize("jobseeker"),
    resumeUpload.single("resume"),
    uploadJobSeekerResume
);
router.get('/recruiter/dashboard',authenticate,authorize("recruiter"),getRecruiterDashboard);
router.get('/admin/dashboard',authenticate,authorize("admin"),getAdminDashboard);
module.exports=router
