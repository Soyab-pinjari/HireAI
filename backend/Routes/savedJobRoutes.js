const express = require("express");
const router = express.Router();

const {
    saveJob,
    getSavedJobs,
    removeSavedJob
} = require("../Controller/SavedJobController");
const { authorize,authenticate } = require("../Middleware/auth");



router.post(
    "/save",
    authenticate,
    authorize("jobseeker"),
    saveJob
);

router.get(
    "/",
    authenticate,
    authorize("jobseeker"),
    getSavedJobs
);

router.delete(
    "/:id",
    authenticate,
    authorize("jobseeker"),
    removeSavedJob
);

module.exports = router;