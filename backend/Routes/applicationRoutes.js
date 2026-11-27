const express = require("express");
const router = express.Router();

const {
    applyJob,
    getUserApplications,
    getRecruiterApplicants,
    updateApplicationStatus
} = require("../Controller/ApplicationController");

const { authenticate, authorize } = require("../Middleware/auth");

router.post(
    "/apply",
    authenticate,
    authorize("jobseeker"),
    applyJob
);
router.get(
    "/jobSeeker-applications",
    authenticate,
    authorize("jobseeker"),
    getUserApplications
);

router.get(
    "/recruiter/applicants",
    authenticate,
    authorize("recruiter"),
    getRecruiterApplicants
);

router.put(
    "/recruiter/applicants/:applicationId/status",
    authenticate,
    authorize("recruiter"),
    updateApplicationStatus
);
module.exports = router;