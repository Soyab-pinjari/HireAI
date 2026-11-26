const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    },

    publicId: {
        type: String,
        required: true
    },

    originalName: {
        type: String,
        required: true
    },

    fileType: {
        type: String,
        default: "application/pdf"
    },

    fileSize: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Resume", resumeSchema);