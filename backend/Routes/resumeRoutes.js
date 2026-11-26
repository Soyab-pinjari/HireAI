const express = require("express");
const getResumeById = require("../Controller/resumeController");

const router = express.Router();

router.get("/:id",getResumeById);
module.exports = router