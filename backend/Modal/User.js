const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  profileImage: {
    type: String,
    default: "",
  },

  location: {
    type: String,
    default: "",
  },

  phone: {
    type: String,
    minlength: 10,
  },

  bio: {
    type: String,
    maxlength: 500,
    default: "",
  },

  role: {
    type: String,
    enum: ["jobseeker", "recruiter", "admin"],
    default: "jobseeker",
    required: true,
  },

  
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },

  skills: {
    type: [String],
    default: [],
  },

  experience: {
    type: Number,
    min: 0,
    default: 0,
  },

  education: {
    type: String,
    default: "",
  },

  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    default: null,
  },

}, {
  timestamps: true,
});

UserSchema.index({ role: 1 });
UserSchema.index({ skills: 1 });

module.exports = mongoose.model("User", UserSchema);