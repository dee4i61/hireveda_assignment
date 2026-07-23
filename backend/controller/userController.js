import User from "../model/User.js";

// ────────────────────────────────────────────────────────
// @desc    Create a new user profile
// @route   POST /api/users
// @access  Private (Admin only)
// ────────────────────────────────────────────────────────
export const createUser = async (req, res) => {
  try {
    // Support both JSON and FormData (when image is attached)
    let body = req.body;
    if (req.body.data) {
      body = JSON.parse(req.body.data);
    }
    const { basicInfo, education, professional, certifications, projects, socialLinks } = body;

    // ── Validate required basicInfo fields ──
    if (!basicInfo) {
      return res.status(400).json({
        success: false,
        message: "Basic information is required",
      });
    }

    const { firstName, lastName, email } = basicInfo;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({
        success: false,
        message: "First name is required",
      });
    }

    if (!lastName || !lastName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Last name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ "basicInfo.email": email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // ── Validate education entries if provided ──
    if (education && Array.isArray(education)) {
      for (let i = 0; i < education.length; i++) {
        const edu = education[i];
        if (!edu.institution || !edu.institution.trim()) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i + 1}: Institution name is required`,
          });
        }
        if (!edu.degree || !edu.degree.trim()) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i + 1}: Degree is required`,
          });
        }
        if (!edu.startYear) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i + 1}: Start year is required`,
          });
        }
        if (edu.endYear && edu.endYear < edu.startYear) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i + 1}: End year cannot be before start year`,
          });
        }
      }
    }

    // ── Validate professional fields if provided ──
    if (professional) {
      if (professional.yearsOfExperience !== undefined && professional.yearsOfExperience < 0) {
        return res.status(400).json({
          success: false,
          message: "Years of experience cannot be negative",
        });
      }
    }

    // ── Validate certifications if provided ──
    if (certifications && Array.isArray(certifications)) {
      for (let i = 0; i < certifications.length; i++) {
        if (!certifications[i].title || !certifications[i].title.trim()) {
          return res.status(400).json({
            success: false,
            message: `Certification ${i + 1}: Title is required`,
          });
        }
      }
    }

    // ── Validate projects if provided ──
    if (projects && Array.isArray(projects)) {
      for (let i = 0; i < projects.length; i++) {
        if (!projects[i].title || !projects[i].title.trim()) {
          return res.status(400).json({
            success: false,
            message: `Project ${i + 1}: Title is required`,
          });
        }
      }
    }

    // ── Create user ──
    const userData = {
      basicInfo,
      education: education || [],
      professional: professional || {},
      certifications: certifications || [],
      projects: projects || [],
      socialLinks: socialLinks || {},
    };

    // If image was uploaded via multer → Cloudinary
    if (req.file) {
      userData.profileImage = req.file.path;
    }

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: "User profile created successfully",
      data: { _id: user._id },
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get a user profile by ID
// @route   GET /api/users/:id
// @access  Public
// ────────────────────────────────────────────────────────
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
// ────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Update a user profile
// @route   PUT /api/users/:id
// @access  Private (Admin only)
// ────────────────────────────────────────────────────────
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Support both JSON and FormData (when image is attached)
    let body = req.body;
    if (req.body.data) {
      body = JSON.parse(req.body.data);
    }
    const { basicInfo, education, professional, certifications, projects, socialLinks } = body;

    // ── Validate email uniqueness if email is being updated ──
    if (basicInfo && basicInfo.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(basicInfo.email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
        });
      }

      const existingUser = await User.findOne({
        "basicInfo.email": basicInfo.email.toLowerCase(),
        _id: { $ne: id },
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "A user with this email already exists",
        });
      }
    }

    // ── Validate education entries if provided ──
    if (education && Array.isArray(education)) {
      for (let i = 0; i < education.length; i++) {
        const edu = education[i];
        if (!edu.institution || !edu.institution.trim()) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i + 1}: Institution name is required`,
          });
        }
        if (!edu.degree || !edu.degree.trim()) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i + 1}: Degree is required`,
          });
        }
        if (edu.endYear && edu.startYear && edu.endYear < edu.startYear) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i + 1}: End year cannot be before start year`,
          });
        }
      }
    }

    // ── Validate professional fields if provided ──
    if (professional && professional.yearsOfExperience !== undefined && professional.yearsOfExperience < 0) {
      return res.status(400).json({
        success: false,
        message: "Years of experience cannot be negative",
      });
    }

    // Build update object
    const updateData = {};
    if (basicInfo) updateData.basicInfo = basicInfo;
    if (education) updateData.education = education;
    if (professional) updateData.professional = professional;
    if (certifications) updateData.certifications = certifications;
    if (projects) updateData.projects = projects;
    if (socialLinks) updateData.socialLinks = socialLinks;

    // If image was uploaded via multer → Cloudinary
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ────────────────────────────────────────────────────────
// @desc    Delete a user profile
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
// ────────────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
