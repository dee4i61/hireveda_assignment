import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../services/userService";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Code2,
  Globe,
  Award,
  Heart,
  Languages,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Edit,
  UserCheck,
  Building2,
  FolderGit2,
  FileText,
  Copy,
} from "lucide-react";
import { FaLinkedinIn, FaGithub, FaTwitter } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const ProfileDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await getUserById(id);
      setUser(response.data);
    } catch (err) {
      setError(err.message || "Failed to load user profile");
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (f, l) => `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  const copyEmail = () => {
    if (user?.basicInfo?.email) {
      navigator.clipboard.writeText(user.basicInfo.email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const hasSocialLinks =
    user?.socialLinks && Object.values(user.socialLinks).some((v) => v);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fafafc" }} className="flex items-center justify-center">
        <div style={{ textAlign: "center" }}>
          <RefreshCw style={{ width: 36, height: 36, color: "#4f46e5", margin: "0 auto 12px" }} className="spinner" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>Loading profile showcase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fafafc", padding: 16 }} className="flex items-center justify-center">
        <div className="saas-card" style={{ padding: 40, textAlign: "center", maxWidth: 420 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>
            😕
          </div>
          <h2 style={{ fontFamily: "Poppins", fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Profile Not Found</h2>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>{error}</p>
          <Link to="/dashboard" className="saas-button-primary" style={{ textDecoration: "none", width: "100%" }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafc", paddingBottom: 64 }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "28px 24px 0" }} className="animate-fadeIn">
        {/* Top Navigation & Actions Bar */}
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <Link
            to="/dashboard"
            className="saas-button-secondary"
            style={{ padding: "8px 14px", fontSize: 13, textDecoration: "none" }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Dashboard
          </Link>

          <Link
            to={`/edit-profile/${user._id}`}
            className="saas-button-primary"
            style={{ padding: "8px 18px", fontSize: 13, textDecoration: "none" }}
          >
            <Edit style={{ width: 16, height: 16 }} /> Edit Profile
          </Link>
        </div>

        {/* ═══════════ LUXURY HERO HEADER BANNER ═══════════ */}
        <div
          className="saas-card"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 24,
            marginBottom: 24,
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Cover Background Pattern Banner */}
          <div
            style={{
              height: 140,
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #0f172a 100%)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 9999,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(8px)",
                fontSize: 12,
                fontWeight: 600,
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Sparkles style={{ width: 14, height: 14, color: "#fbbf24" }} />
              HireVeda Verified Candidate
            </div>
          </div>

          {/* Profile Identity Details Row */}
          <div style={{ padding: "0 28px 28px 28px", marginTop: -50, position: "relative", zIndex: 10 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between" style={{ gap: 20 }}>
              {/* Photo Avatar */}
              <div className="flex items-end" style={{ gap: 20 }}>
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={`${user.basicInfo?.firstName}`}
                    style={{
                      width: 112,
                      height: 112,
                      borderRadius: 24,
                      objectFit: "cover",
                      border: "4px solid #ffffff",
                      boxShadow: "0 10px 25px rgba(79, 70, 229, 0.2), 0 0 0 1px #e2e8f0",
                      backgroundColor: "#ffffff",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 112,
                      height: 112,
                      borderRadius: 24,
                      background: "linear-gradient(135deg, #4f46e5, #4338ca)",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: 38,
                      fontFamily: "Poppins",
                      border: "4px solid #ffffff",
                      boxShadow: "0 10px 25px rgba(79, 70, 229, 0.25)",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(user.basicInfo?.firstName, user.basicInfo?.lastName)}
                  </div>
                )}

                <div style={{ paddingBottom: 4 }}>
                  <div className="flex items-center" style={{ gap: 10, flexWrap: "wrap" }}>
                    <h1 style={{ fontFamily: "Poppins", fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
                      {user.basicInfo?.firstName} {user.basicInfo?.lastName}
                    </h1>
                    <span className="badge-emerald inline-flex items-center" style={{ gap: 4 }}>
                      <CheckCircle2 style={{ width: 13, height: 13 }} /> Verified Profile
                    </span>
                  </div>

                  {user.professional?.currentRole ? (
                    <p className="flex items-center" style={{ fontSize: 15, fontWeight: 700, color: "#4f46e5", gap: 6, marginTop: 4 }}>
                      <Briefcase style={{ width: 16, height: 16 }} />
                      {user.professional.currentRole}
                    </p>
                  ) : (
                    <span style={{ fontSize: 13, color: "#64748b", marginTop: 4, display: "block" }}>Profile Active</span>
                  )}
                </div>
              </div>

              {/* Social Links Row */}
              {hasSocialLinks && (
                <div className="flex items-center" style={{ gap: 10, paddingBottom: 4 }}>
                  {user.socialLinks?.linkedin && (
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                      <FaLinkedinIn />
                    </a>
                  )}
                  {user.socialLinks?.github && (
                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
                      <FaGithub />
                    </a>
                  )}
                  {user.socialLinks?.twitter && (
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                      <FaTwitter />
                    </a>
                  )}
                  {user.socialLinks?.leetcode && (
                    <a href={user.socialLinks.leetcode} target="_blank" rel="noopener noreferrer" className="social-icon" title="LeetCode">
                      <SiLeetcode />
                    </a>
                  )}
                  {user.socialLinks?.portfolioUrl && (
                    <a href={user.socialLinks.portfolioUrl} target="_blank" rel="noopener noreferrer" className="social-icon" title="Portfolio">
                      <Globe style={{ width: 16, height: 16 }} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Sub Info Pills Row */}
            <div
              className="flex flex-wrap items-center"
              style={{ gap: 20, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9", fontSize: 13, color: "#475569", fontWeight: 500 }}
            >
              {user.basicInfo?.email && (
                <div className="flex items-center" style={{ gap: 6 }}>
                  <Mail style={{ width: 15, height: 15, color: "#4f46e5" }} />
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>{user.basicInfo.email}</span>
                  <button
                    onClick={copyEmail}
                    style={{ background: "none", border: "none", cursor: "pointer", color: copiedEmail ? "#10b981" : "#94a3b8", padding: 2 }}
                    title="Copy Email"
                  >
                    <Copy style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              )}

              {user.basicInfo?.location && (
                <div className="flex items-center" style={{ gap: 6 }}>
                  <MapPin style={{ width: 15, height: 15, color: "#4f46e5" }} />
                  <span>{user.basicInfo.location}</span>
                </div>
              )}

              {user.professional?.yearsOfExperience > 0 && (
                <div className="flex items-center" style={{ gap: 6 }}>
                  <Briefcase style={{ width: 15, height: 15, color: "#4f46e5" }} />
                  <span>{user.professional.yearsOfExperience} Years Experience</span>
                </div>
              )}

              <div className="flex items-center" style={{ gap: 6, color: "#94a3b8" }}>
                <Calendar style={{ width: 15, height: 15 }} />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ QUICK METRICS STAT STRIP ═══════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div className="saas-card" style={{ padding: "18px 20px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Experience
            </span>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", fontFamily: "Poppins", marginTop: 2 }}>
              {user.professional?.yearsOfExperience || 0} <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Years</span>
            </h3>
          </div>

          <div className="saas-card" style={{ padding: "18px 20px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Technical Skills
            </span>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: "#4f46e5", fontFamily: "Poppins", marginTop: 2 }}>
              {user.professional?.skills?.length || 0} <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Tagged</span>
            </h3>
          </div>

          <div className="saas-card" style={{ padding: "18px 20px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Education Degrees
            </span>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: "#047857", fontFamily: "Poppins", marginTop: 2 }}>
              {user.education?.length || 0} <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Completed</span>
            </h3>
          </div>

          <div className="saas-card" style={{ padding: "18px 20px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Portfolio Projects
            </span>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: "#7e22ce", fontFamily: "Poppins", marginTop: 2 }}>
              {user.projects?.length || 0} <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Showcased</span>
            </h3>
          </div>
        </div>

        {/* ═══════════ TWO-COLUMN DETAILS GRID ═══════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24, alignItems: "start" }}>
          
          {/* ── LEFT SIDEBAR (CONTACT, BIO, LANGUAGES) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Bio Card */}
            {user.basicInfo?.bio && (
              <div className="saas-card" style={{ padding: 24 }}>
                <h3 className="flex items-center" style={{ gap: 8, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                  <FileText style={{ width: 16, height: 16, color: "#4f46e5" }} /> Executive Bio & Summary
                </h3>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>
                  "{user.basicInfo.bio}"
                </p>
              </div>
            )}

            {/* Contact Card */}
            <div className="saas-card" style={{ padding: 24 }}>
              <h3 className="flex items-center" style={{ gap: 8, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                <UserCheck style={{ width: 16, height: 16, color: "#4f46e5" }} /> Contact Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13 }}>
                <div className="flex items-center" style={{ gap: 12 }}>
                  <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}>
                    <Mail style={{ width: 16, height: 16 }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Email Address</p>
                    <p style={{ fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.basicInfo?.email}
                    </p>
                  </div>
                </div>

                {user.basicInfo?.phone && (
                  <div className="flex items-center" style={{ gap: 12 }}>
                    <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}>
                      <Phone style={{ width: 16, height: 16 }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Phone Number</p>
                      <p style={{ fontWeight: 700, color: "#0f172a" }}>{user.basicInfo.phone}</p>
                    </div>
                  </div>
                )}

                {user.basicInfo?.location && (
                  <div className="flex items-center" style={{ gap: 12 }}>
                    <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}>
                      <MapPin style={{ width: 16, height: 16 }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Location</p>
                      <p style={{ fontWeight: 700, color: "#0f172a" }}>{user.basicInfo.location}</p>
                    </div>
                  </div>
                )}

                {user.basicInfo?.dateOfBirth && (
                  <div className="flex items-center" style={{ gap: 12 }}>
                    <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}>
                      <Calendar style={{ width: 16, height: 16 }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Date of Birth</p>
                      <p style={{ fontWeight: 700, color: "#0f172a" }}>
                        {formatDate(user.basicInfo.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                )}

                {user.basicInfo?.gender && (
                  <div className="flex items-center" style={{ gap: 12 }}>
                    <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5", flexShrink: 0 }}>
                      <Heart style={{ width: 16, height: 16 }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Gender</p>
                      <p style={{ fontWeight: 700, color: "#0f172a" }}>{user.basicInfo.gender}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages Known */}
            {user.professional?.languages?.length > 0 && (
              <div className="saas-card" style={{ padding: 24 }}>
                <h3 className="flex items-center" style={{ gap: 8, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                  <Languages style={{ width: 16, height: 16, color: "#4f46e5" }} /> Languages Known
                </h3>
                <div className="flex flex-wrap" style={{ gap: 6 }}>
                  {user.professional.languages.map((lang, i) => (
                    <span key={i} className="badge-slate" style={{ fontSize: 12 }}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {user.professional?.interests?.length > 0 && (
              <div className="saas-card" style={{ padding: 24 }}>
                <h3 className="flex items-center" style={{ gap: 8, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                  <Heart style={{ width: 16, height: 16, color: "#4f46e5" }} /> Focus Areas & Interests
                </h3>
                <div className="flex flex-wrap" style={{ gap: 6 }}>
                  {user.professional.interests.map((interest, i) => (
                    <span key={i} className="badge-indigo" style={{ fontSize: 12 }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT MAIN COLUMN: SKILLS, PROJECTS, EDUCATION, CERTIFICATIONS ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Technical Skills Tag Cloud */}
            {user.professional?.skills?.length > 0 && (
              <div className="saas-card" style={{ padding: 24 }}>
                <h3 className="flex items-center" style={{ gap: 8, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                  <Code2 style={{ width: 16, height: 16, color: "#4f46e5" }} /> Technical Skills & Technologies
                </h3>
                <div className="flex flex-wrap" style={{ gap: 8 }}>
                  {user.professional.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="badge-indigo"
                      style={{ padding: "6px 14px", fontSize: 13, fontWeight: 700, borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      <Sparkles style={{ width: 12, height: 12, color: "#6366f1" }} /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Projects Cards */}
            {user.projects?.length > 0 && (
              <div className="saas-card" style={{ padding: 24 }}>
                <h3 className="flex items-center" style={{ gap: 8, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                  <FolderGit2 style={{ width: 16, height: 16, color: "#4f46e5" }} /> Featured Projects & Portfolio
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {user.projects.map((project, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 20,
                        borderRadius: 16,
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div className="flex items-start justify-between" style={{ gap: 14 }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontFamily: "Poppins", fontWeight: 700, color: "#0f172a", fontSize: 16 }}>{project.title}</h4>
                          {project.description && (
                            <p style={{ fontSize: 13, color: "#64748b", marginTop: 6, lineHeight: 1.6 }}>
                              {project.description}
                            </p>
                          )}
                          {project.techStack?.length > 0 && (
                            <div className="flex flex-wrap" style={{ gap: 6, marginTop: 12 }}>
                              {project.techStack.map((tech, j) => (
                                <span key={j} className="badge-slate" style={{ fontSize: 11, fontWeight: 600 }}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="saas-button-secondary"
                            style={{ padding: "8px 14px", fontSize: 12, flexShrink: 0, textDecoration: "none" }}
                          >
                            <span>Live Link</span>
                            <ExternalLink style={{ width: 14, height: 14 }} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Academic History Timeline */}
            {user.education?.length > 0 && (
              <div className="saas-card" style={{ padding: 24 }}>
                <h3 className="flex items-center" style={{ gap: 8, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>
                  <GraduationCap style={{ width: 16, height: 16, color: "#4f46e5" }} /> Academic Journey
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {user.education.map((edu, i) => (
                    <div key={i} style={{ padding: 20, borderRadius: 16, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between" style={{ gap: 10 }}>
                        <div>
                          <h4 style={{ fontFamily: "Poppins", fontWeight: 700, color: "#0f172a", fontSize: 16 }}>{edu.degree}</h4>
                          {edu.fieldOfStudy && (
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5", marginTop: 2 }}>{edu.fieldOfStudy}</p>
                          )}
                          <p className="flex items-center" style={{ fontSize: 13, fontWeight: 500, color: "#475569", gap: 6, marginTop: 4 }}>
                            <Building2 style={{ width: 14, height: 14, color: "#94a3b8" }} /> {edu.institution}
                          </p>
                        </div>

                        <div style={{ flexShrink: 0 }}>
                          <span className="badge-indigo" style={{ fontWeight: 700 }}>
                            {edu.startYear} — {edu.endYear || "Present"}
                          </span>
                          {edu.grade && (
                            <p style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 600, textAlign: "right" }}>
                              Grade: {edu.grade}
                            </p>
                          )}
                        </div>
                      </div>

                      {edu.description && (
                        <p style={{ fontSize: 13, color: "#64748b", marginTop: 12, lineHeight: 1.6 }}>
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Grid */}
            {user.certifications?.length > 0 && (
              <div className="saas-card" style={{ padding: 24 }}>
                <h3 className="flex items-center" style={{ gap: 8, fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                  <Award style={{ width: 16, height: 16, color: "#4f46e5" }} /> Certifications & Credentials
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                  {user.certifications.map((cert, i) => (
                    <div key={i} style={{ padding: 18, borderRadius: 14, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
                      <div className="flex items-start justify-between" style={{ gap: 10 }}>
                        <div>
                          <h4 style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{cert.title}</h4>
                          {cert.issuer && <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{cert.issuer}</p>}
                          {cert.year && <p style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", marginTop: 4 }}>{cert.year}</p>}
                        </div>
                        {cert.link && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ padding: 8, borderRadius: 10, backgroundColor: "#eef2ff", color: "#4f46e5", textDecoration: "none", flexShrink: 0 }}
                            title="Verify Certificate"
                          >
                            <ExternalLink style={{ width: 15, height: 15 }} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileDashboard;
