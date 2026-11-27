const express =require ("express");



const { authenticate, authorize } = require("../Middleware/auth.js");
const {analyzeResume, getResumeAnalysisHistory,} = require("../Controller/aiController.js");


const router = express.Router();


router.post(
    "/analyze",
      authenticate,
    analyzeResume
);

router.get(
    "/history",
     authenticate,
    getResumeAnalysisHistory
);

module.exports =  router;