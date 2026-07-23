import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, "Institution name is required"],
    trim: true,
  },
  degree: {
    type: String,
    required: [true, "Degree is required"],
    trim: true,
  },
  fieldOfStudy: {
    type: String,
    trim: true,
  },
  startYear: {
    type: Number,
    required: [true, "Start year is required"],
  },
  endYear: {
    type: Number,
  },
  grade: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Certification title is required"],
    trim: true,
  },
  issuer: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
  },
  link: {
    type: String,
    trim: true,
  },
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Project title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  link: {
    type: String,
    trim: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    basicInfo: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters"],
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Please enter a valid email address",
        ],
      },
      phone: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
      dateOfBirth: {
        type: Date,
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Prefer not to say", ""],
        default: "",
      },
      bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
      },
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    professional: {
      currentRole: {
        type: String,
        trim: true,
      },
      yearsOfExperience: {
        type: Number,
        min: [0, "Years of experience cannot be negative"],
        default: 0,
      },
      skills: {
        type: [String],
        default: [],
      },
      languages: {
        type: [String],
        default: [],
      },
      interests: {
        type: [String],
        default: [],
      },
    },

    certifications: {
      type: [certificationSchema],
      default: [],
    },

    projects: {
      type: [projectSchema],
      default: [],
    },

    profileImage: {
      type: String,
      default: "",
    },

    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      portfolioUrl: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      leetcode: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
