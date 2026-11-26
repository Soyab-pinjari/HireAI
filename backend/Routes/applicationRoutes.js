const express = require("express");
const router = express.Router();

const {
    applyJob
} = require("../Controller/ApplicationController");

const { authenticate, authorize } = require("../Middleware/auth");

router.post(
    "/apply",
    authenticate,
    authorize("jobseeker"),
    applyJob
);

module.exports = router;