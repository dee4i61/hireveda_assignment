import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { createUser } from "../services/userService";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Globe,
  Upload,
  Trash2,
  Plus,
  Sparkles,
  Save,
  X,
} from "lucide-react";

const CreateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      basicInfo: { firstName: "", lastName: "", email: "", phone: "", location: "", dateOfBirth: "", gender: "", bio: "" },
      education: [{ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "", description: "" }],
      professional: { currentRole: "", yearsOfExperience: "", skills: "", languages: "", interests: "" },
      certifications: [],
      projects: [],
      socialLinks: { linkedin: "", github: "", portfolioUrl: "", twitter: "", leetcode: "" },
    },
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control, name: "education" });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications" });
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control, name: "projects" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be under 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAutoSelectDOB = (yearsAgo) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    const formatted = date.toISOString().split("T")[0];
    setValue("basicInfo.dateOfBirth", formatted, { shouldValidate: true });
    toast.success(`Set DOB to ${yearsAgo} years ago (${formatted})`);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const transformedData = {
        ...data,
        professional: {
          ...data.professional,
          yearsOfExperience: data.professional.yearsOfExperience ? Number(data.professional.yearsOfExperience) : 0,
          skills: data.professional.skills ? data.professional.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
          languages: data.professional.languages ? data.professional.languages.split(",").map((s) => s.trim()).filter(Boolean) : [],
          interests: data.professional.interests ? data.professional.interests.split(",").map((s) => s.trim()).filter(Boolean) : [],
        },
        education: data.education.filter((e) => e.institution && e.degree),
        certifications: data.certifications.filter((c) => c.title),
        projects: data.projects
          .filter((p) => p.title)
          .map((p) => ({
            ...p,
            techStack: typeof p.techStack === "string" ? p.techStack.split(",").map((s) => s.trim()).filter(Boolean) : p.techStack || [],
          })),
      };

      const response = await createUser(transformedData, imageFile);
      toast.success("User profile created successfully!");
      navigate(`/profile/${response.data._id}`);
    } catch (error) {
      toast.error(error.message || "Failed to create user profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafc", paddingBottom: 64 }}>
      <Navbar />

      <main style={{ maxWidth: 960, margin: "0 auto", width: "100%", padding: "32px 24px" }} className="animate-fadeInUp">
        {/* Header Breadcrumb */}
        <div className="flex items-center" style={{ gap: 14, marginBottom: 28 }}>
          <Link
            to="/dashboard"
            className="flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              color: "#475569",
              textDecoration: "none",
            }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} />
          </Link>
          <div>
            <h1 style={{ fontFamily: "Poppins", fontSize: 22, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
              Create User Profile
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
              Fill in student or professional details to register on HireVeda
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* ═══ PROFILE IMAGE UPLOAD ═══ */}
          <section className="saas-card" style={{ padding: 28 }}>
            <div className="flex items-center" style={{ gap: 14, marginBottom: 20 }}>
              <div
                className="flex items-center justify-center"
                style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}
              >
                <Upload style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <h2 style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Profile Photo</h2>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Upload profile image to Cloudinary storage</p>
              </div>
            </div>

            <div className="flex items-center" style={{ gap: 20 }}>
              {imagePreview ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: 96, height: 96, borderRadius: 18, objectFit: "cover", border: "3px solid #4f46e5", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}
                  />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                      color: "#ffffff",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              ) : (
                <label
                  style={{
                    flex: 1,
                    border: "2px dashed #cbd5e1",
                    borderRadius: 16,
                    padding: "24px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#f8fafc",
                    transition: "all 0.2s",
                    display: "block",
                  }}
                >
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <Upload style={{ width: 28, height: 28, color: "#4f46e5", margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Click to upload photo</p>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Supports PNG, JPG, WEBP (Max 5MB)</p>
                </label>
              )}
            </div>
          </section>

          {/* ═══ BASIC INFO ═══ */}
          <section className="saas-card" style={{ padding: 28 }}>
            <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
              <div
                className="flex items-center justify-center"
                style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}
              >
                <User style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <h2 style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Basic Information</h2>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Personal & contact details</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <div>
                <label className="saas-label">First Name *</label>
                <input
                  className="saas-input"
                  placeholder="John"
                  {...register("basicInfo.firstName", { required: "First name is required", minLength: { value: 2, message: "At least 2 chars" } })}
                />
                {errors.basicInfo?.firstName && <p className="input-error">{errors.basicInfo.firstName.message}</p>}
              </div>

              <div>
                <label className="saas-label">Last Name *</label>
                <input
                  className="saas-input"
                  placeholder="Doe"
                  {...register("basicInfo.lastName", { required: "Last name is required", minLength: { value: 2, message: "At least 2 chars" } })}
                />
                {errors.basicInfo?.lastName && <p className="input-error">{errors.basicInfo.lastName.message}</p>}
              </div>

              <div>
                <label className="saas-label">Email Address *</label>
                <input
                  type="email"
                  className="saas-input"
                  placeholder="john@example.com"
                  {...register("basicInfo.email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Valid email required" } })}
                />
                {errors.basicInfo?.email && <p className="input-error">{errors.basicInfo.email.message}</p>}
              </div>

              <div>
                <label className="saas-label">Phone Number</label>
                <input type="tel" className="saas-input" placeholder="+91 98765 43210" {...register("basicInfo.phone")} />
              </div>

              <div>
                <label className="saas-label">Location</label>
                <input className="saas-input" placeholder="Mumbai, India" {...register("basicInfo.location")} />
              </div>

              {/* DOB WITH AUTO SELECT PRESETS */}
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <label className="saas-label" style={{ marginBottom: 0 }}>Date of Birth</label>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5" }} className="flex items-center gap-1">
                    <Sparkles style={{ width: 12, height: 12 }} /> Quick Presets
                  </span>
                </div>
                <input type="date" className="saas-input" {...register("basicInfo.dateOfBirth")} />
                <div className="flex flex-wrap" style={{ gap: 6, marginTop: 8 }}>
                  <button type="button" onClick={() => handleAutoSelectDOB(20)} className="badge-indigo" style={{ cursor: "pointer", border: "1px solid #c7d2fe" }}>
                    20 Yrs Ago
                  </button>
                  <button type="button" onClick={() => handleAutoSelectDOB(22)} className="badge-indigo" style={{ cursor: "pointer", border: "1px solid #c7d2fe" }}>
                    22 Yrs Ago
                  </button>
                  <button type="button" onClick={() => handleAutoSelectDOB(25)} className="badge-indigo" style={{ cursor: "pointer", border: "1px solid #c7d2fe" }}>
                    25 Yrs Ago
                  </button>
                </div>
              </div>

              <div>
                <label className="saas-label">Gender</label>
                <select className="saas-input" {...register("basicInfo.gender")}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label className="saas-label">Bio / Summary</label>
                <textarea
                  className="saas-input"
                  rows={3}
                  placeholder="Write a concise professional summary..."
                  style={{ resize: "none" }}
                  {...register("basicInfo.bio")}
                />
              </div>
            </div>
          </section>

          {/* ═══ EDUCATION ═══ */}
          <section className="saas-card" style={{ padding: 28 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <div className="flex items-center" style={{ gap: 14 }}>
                <div
                  className="flex items-center justify-center"
                  style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}
                >
                  <GraduationCap style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Education</h2>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Academic background</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => appendEducation({ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "", description: "" })}
                className="saas-button-secondary"
                style={{ padding: "6px 12px", fontSize: 12 }}
              >
                <Plus style={{ width: 14, height: 14 }} /> Add
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {educationFields.map((field, index) => (
                <div key={field.id} style={{ padding: 20, borderRadius: 14, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", position: "relative" }}>
                  {educationFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                    >
                      <Trash2 style={{ width: 16, height: 16 }} />
                    </button>
                  )}
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", marginBottom: 14 }}>Education #{index + 1}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                    <div>
                      <label className="saas-label">Institution *</label>
                      <input className="saas-input" placeholder="University Name" {...register(`education.${index}.institution`, { required: "Required" })} />
                    </div>
                    <div>
                      <label className="saas-label">Degree *</label>
                      <input className="saas-input" placeholder="B.Tech, B.Sc" {...register(`education.${index}.degree`, { required: "Required" })} />
                    </div>
                    <div>
                      <label className="saas-label">Field of Study</label>
                      <input className="saas-input" placeholder="Computer Science" {...register(`education.${index}.fieldOfStudy`)} />
                    </div>
                    <div>
                      <label className="saas-label">Grade / CGPA</label>
                      <input className="saas-input" placeholder="8.5 CGPA" {...register(`education.${index}.grade`)} />
                    </div>
                    <div>
                      <label className="saas-label">Start Year *</label>
                      <input type="number" className="saas-input" placeholder="2020" {...register(`education.${index}.startYear`, { required: "Required" })} />
                    </div>
                    <div>
                      <label className="saas-label">End Year</label>
                      <input type="number" className="saas-input" placeholder="2024" {...register(`education.${index}.endYear`)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ PROFESSIONAL ═══ */}
          <section className="saas-card" style={{ padding: 28 }}>
            <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
              <div
                className="flex items-center justify-center"
                style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}
              >
                <Briefcase style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <h2 style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Professional Experience</h2>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Current role and skill set</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <div>
                <label className="saas-label">Current Role</label>
                <input className="saas-input" placeholder="Frontend Engineer" {...register("professional.currentRole")} />
              </div>

              <div>
                <label className="saas-label">Years of Experience</label>
                <input type="number" className="saas-input" placeholder="2" {...register("professional.yearsOfExperience")} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label className="saas-label">Skills (comma separated)</label>
                <input className="saas-input" placeholder="React, Node.js, Express, MongoDB, Tailwind" {...register("professional.skills")} />
              </div>

              <div>
                <label className="saas-label">Languages (comma separated)</label>
                <input className="saas-input" placeholder="English, Hindi" {...register("professional.languages")} />
              </div>

              <div>
                <label className="saas-label">Interests (comma separated)</label>
                <input className="saas-input" placeholder="Web Dev, Open Source" {...register("professional.interests")} />
              </div>
            </div>
          </section>

          {/* ═══ CERTIFICATIONS ═══ */}
          <section className="saas-card" style={{ padding: 28 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <div className="flex items-center" style={{ gap: 14 }}>
                <div
                  className="flex items-center justify-center"
                  style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}
                >
                  <Award style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Certifications</h2>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Industry credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => appendCert({ title: "", issuer: "", year: "", link: "" })}
                className="saas-button-secondary"
                style={{ padding: "6px 12px", fontSize: 12 }}
              >
                <Plus style={{ width: 14, height: 14 }} /> Add
              </button>
            </div>

            {certFields.length === 0 ? (
              <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: "12px 0" }}>No certifications added yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {certFields.map((field, index) => (
                  <div key={field.id} style={{ padding: 18, borderRadius: 14, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", position: "relative" }}>
                    <button type="button" onClick={() => removeCert(index)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                      <Trash2 style={{ width: 16, height: 16 }} />
                    </button>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                      <div>
                        <label className="saas-label">Title *</label>
                        <input className="saas-input" placeholder="AWS Certified Developer" {...register(`certifications.${index}.title`, { required: "Required" })} />
                      </div>
                      <div>
                        <label className="saas-label">Issuer</label>
                        <input className="saas-input" placeholder="Amazon Web Services" {...register(`certifications.${index}.issuer`)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ═══ PROJECTS ═══ */}
          <section className="saas-card" style={{ padding: 28 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <div className="flex items-center" style={{ gap: 14 }}>
                <div
                  className="flex items-center justify-center"
                  style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}
                >
                  <Code style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Projects</h2>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Portfolio projects</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => appendProject({ title: "", description: "", techStack: "", link: "" })}
                className="saas-button-secondary"
                style={{ padding: "6px 12px", fontSize: 12 }}
              >
                <Plus style={{ width: 14, height: 14 }} /> Add
              </button>
            </div>

            {projectFields.length === 0 ? (
              <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: "12px 0" }}>No projects added yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {projectFields.map((field, index) => (
                  <div key={field.id} style={{ padding: 18, borderRadius: 14, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", position: "relative" }}>
                    <button type="button" onClick={() => removeProject(index)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                      <Trash2 style={{ width: 16, height: 16 }} />
                    </button>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                      <div>
                        <label className="saas-label">Title *</label>
                        <input className="saas-input" placeholder="HireVeda SaaS Portal" {...register(`projects.${index}.title`, { required: "Required" })} />
                      </div>
                      <div>
                        <label className="saas-label">Tech Stack (comma separated)</label>
                        <input className="saas-input" placeholder="React, Express, MongoDB" {...register(`projects.${index}.techStack`)} />
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label className="saas-label">Project Link</label>
                        <input type="url" className="saas-input" placeholder="https://github.com/..." {...register(`projects.${index}.link`)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ═══ SOCIAL LINKS ═══ */}
          <section className="saas-card" style={{ padding: 28 }}>
            <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
              <div
                className="flex items-center justify-center"
                style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}
              >
                <Globe style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <h2 style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Social Links</h2>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Online presence & profiles</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <div>
                <label className="saas-label">LinkedIn</label>
                <input type="url" className="saas-input" placeholder="https://linkedin.com/in/username" {...register("socialLinks.linkedin")} />
              </div>
              <div>
                <label className="saas-label">GitHub</label>
                <input type="url" className="saas-input" placeholder="https://github.com/username" {...register("socialLinks.github")} />
              </div>
              <div>
                <label className="saas-label">Portfolio URL</label>
                <input type="url" className="saas-input" placeholder="https://portfolio.com" {...register("socialLinks.portfolioUrl")} />
              </div>
              <div>
                <label className="saas-label">LeetCode</label>
                <input type="url" className="saas-input" placeholder="https://leetcode.com/username" {...register("socialLinks.leetcode")} />
              </div>
            </div>
          </section>

          {/* Submit Action */}
          <div className="flex items-center justify-end" style={{ gap: 12, paddingTop: 16 }}>
            <Link to="/dashboard" className="saas-button-secondary" style={{ textDecoration: "none" }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="saas-button-primary" style={{ padding: "12px 28px" }}>
              <Save style={{ width: 16, height: 16 }} />
              {loading ? "Saving Profile..." : "Save Profile"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProfile;
