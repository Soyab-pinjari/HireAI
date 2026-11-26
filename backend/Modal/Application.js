const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },

    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
        default: null
    },

    coverLetter: {
        type: String,
        maxlength: 2000,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "pending",
            "reviewed",
            "shortlisted",
            "rejected",
            "accepted"
        ],
        default: "pending"
    }

}, {
    timestamps: true
});

// One user can apply only once for a particular job
applicationSchema.index(
    { job: 1, applicant: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "Application",
    applicationSchema
);