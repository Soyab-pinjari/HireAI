
const mongoose = require("mongoose");
const Company = require("../Modal/Company");
const Job = require("../Modal/Job");
const User = require("../Modal/User")
const uploadImage = require("../Utills/uploadImage");

// CREATE COMPANY

const createCompany = async (req, res) => {
  try {
 const {
  companyName,
  companyEmail,
  phone,
  website,
  industry,
  companySize,
  foundedYear,
  description,
  country,
  state,
  city,
  pincode,
  linkedin,
  twitter,
} = req.body;
    // 1. Recruiter validation
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create a company",
      });
    }

    // 2. Required field validation
    if (!companyName || !companyEmail || !industry) {
      return res.status(400).json({
        success: false,
        message: "Company name, email and industry are required",
      });
    }

    // 3. Check recruiter
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    // 4. Check existing company for recruiter
    if (user.company) {
      return res.status(400).json({
        success: false,
        message: "You already have a company profile",
      });
    }

    // 5. Check duplicate email
    const existingCompany = await Company.findOne({
      companyEmail: companyEmail.toLowerCase().trim(),
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company with this email already exists",
      });
    }

    // 6. Upload image to Cloudinary
    let profileImage = "";

    if (req.file) {
      const uploadedImage = await uploadImage(
        req.file.buffer,
        "job-portal/company-logos"
      );

      profileImage = uploadedImage.url;
    }

    // 7. Create company
    const company = await Company.create({
      companyName,
      companyEmail,
      phone,
      website,
      profileImage,
      industry,
      companySize,
      foundedYear: foundedYear
        ? Number(foundedYear)
        : undefined,
      description,
      country,
      state,
      city,
      pincode,
      linkedin,
      twitter,
    });

    // 8. Associate company with recruiter
    user.company = company._id;
    await user.save();

    // 9. Success response
    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });

  } catch (error) {
    console.error("Create Company Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL COMPANIES
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("jobs")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: companies.length,
      companies,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET COMPANY BY ID
const getCompanyById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await Company.findById(req.params.id)
      .populate("jobs");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateCompany = async (req, res) => {
  try {
console.log("FILE RECEIVED:", req.file);
console.log("BODY:", req.body);
    // 1. Request body se fields lo
    const {
      companyName,
      companyEmail,
      phone,
      website,
      industry,
      companySize,
      foundedYear,
      description,
      country,
      state,
      city,
      pincode,
      linkedin,
      twitter,
    } = req.body;

    // 2. Company find karo
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // 3. Existing image maintain karo
    let profileImage = company.profileImage||"";

    // 4. New image Cloudinary par upload karo
    if (req.file) {
      const uploadedImage = await uploadImage(
        req.file.buffer,
        "job-portal/company-logos"
      );

      profileImage = uploadedImage.secure_url;
    }
    console.log("FINAL PROFILE IMAGE:", profileImage);

    // 5. YAHAN updateData add karo
   const updateData = {
  companyName,
  companyEmail,
  phone,
  website,
  industry,
  companySize,
  foundedYear: foundedYear ? Number(foundedYear) : undefined,
  description,
  country,
  state,
  city,
  pincode,
  linkedin,
  twitter,
  profileImage,
};
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // 6. Database update
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });

  } catch (error) {
    console.error("UPDATE COMPANY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// DELETE COMPANY
const deleteCompany = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    session.startTransaction();

    const company = await Company.findById(req.params.id)
      .session(session);

    if (!company) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Delete related jobs
    const deletedJobs = await Job.deleteMany({
      company: company._id,
    }).session(session);

    // Delete company
    await Company.findByIdAndDelete(company._id)
      .session(session);

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Company and related jobs deleted successfully",
      deletedJobs: deletedJobs.deletedCount,
    });

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  } finally {
    session.endSession();
  }
};


module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
