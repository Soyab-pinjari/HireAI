
const { default: mongoose } = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    // Basic Company Details
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
      minlength: 10,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Company Information
    industry: {
      type: String,
      required: true,
      trim: true,
    },

    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
      ],
      default: "1-10",
    },

    foundedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Location Details
    country: {
      type: String,
      default: "India",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    pincode: {
      type: String,
      default: "",
      trim: true,
    },

    // Social Media Links
    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    twitter: {
      type: String,
      default: "",
      trim: true,
    },

    // Company Jobs
    jobs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", CompanySchema);
