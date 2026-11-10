
const Company = require("../Modal/Company");
const Job = require('../Modal/Job')
const createCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      phone,
      profileImage,
      industry,
      description,
      country,
      address,
    } = req.body;

    // Required field validation
    if (!companyName || !companyEmail || !industry) {
      return res.status(400).json({
        success: false,
        message: "Company name, email and industry are required",
      });
    }

    const existingCompany = await Company.findOne({
      companyEmail: companyEmail.toLowerCase(),
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company with this email already exists",
      });
    }

    const company = await Company.create({
      companyName,
      companyEmail,
      phone,
      profileImage,
      industry,
      description,
      country,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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


const getCompanyById = async (req, res) => {
  try {
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
    const {
      companyName,
      companyEmail,
      phone,
      profileImage,
      industry,
      description,
      country,
      address,
    } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (companyEmail && companyEmail.toLowerCase() !== company.companyEmail) {
      const existingCompany = await Company.findOne({
        companyEmail: companyEmail.toLowerCase(),
        _id: { $ne: req.params.id },
      });

      if (existingCompany) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      {
        companyName,
        companyEmail,
        phone,
        profileImage,
        industry,
        description,
        country,
        address,
      },
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteCompany = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const company = await Company.findById(req.params.id).session(session);

    if (!company) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Delete all jobs belonging to this company
    const deletedJobs = await Job.deleteMany({
      company: company._id,
    }).session(session);

    // Delete company
    await Company.findByIdAndDelete(company._id).session(session);

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Company and related jobs deleted successfully",
      deletedJobs: deletedJobs.deletedCount,
    });

  } catch (error) {
    await session.abortTransaction();

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
