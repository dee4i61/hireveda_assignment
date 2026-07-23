import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllUsers, deleteUser } from "../services/userService";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit,
  Trash2,
  Briefcase,
  MapPin,
  Mail,
  Sparkles,
  LayoutGrid,
  List,
  RefreshCw,
  Code2,
  HardDrive,
  CheckCircle2,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      if (error.status === 401 || error.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error("Failed to fetch user profiles");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s profile?`))
      return;
    setDeleteLoading(id);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User profile deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete user profile");
    } finally {
      setDeleteLoading(null);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.basicInfo?.firstName || ""} ${user.basicInfo?.lastName || ""}`.toLowerCase();
    const email = (user.basicInfo?.email || "").toLowerCase();
    const role = (user.professional?.currentRole || "").toLowerCase();
    const skills = (user.professional?.skills || []).join(" ").toLowerCase();
    const query = searchTerm.toLowerCase();

    return (
      fullName.includes(query) ||
      email.includes(query) ||
      role.includes(query) ||
      skills.includes(query)
    );
  });

  // Calculate stats
  const totalSkillsCount = users.reduce(
    (acc, user) => acc + (user.professional?.skills?.length || 0),
    0
  );
  const mediaCount = users.filter((u) => u.profileImage).length;
  const rolesCount = new Set(
    users.map((u) => u.professional?.currentRole).filter(Boolean)
  ).size;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafc", paddingBottom: 64 }}>
      {/* SaaS Navigation */}
      <Navbar />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 0" }}>
        {/* ═══════════ GRADIENT HERO BANNER ═══════════ */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 20,
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)",
            color: "#ffffff",
            padding: "32px",
            marginBottom: 28,
            boxShadow: "0 10px 30px -5px rgba(30, 27, 75, 0.25)",
          }}
        >
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between"
            style={{ gap: 24, position: "relative", zIndex: 10 }}
          >
            <div>
              <div
                className="inline-flex items-center"
                style={{
                  gap: 8,
                  padding: "4px 12px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(8px)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#c7d2fe",
                  marginBottom: 12,
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <Sparkles style={{ width: 14, height: 14, color: "#fbbf24" }} />
                <span>HireVeda Platform</span>
              </div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#ffffff",
                  fontFamily: "Poppins, sans-serif",
                  lineHeight: 1.2,
                }}
              >
                Welcome back, {adminData.name || "Admin"} 👋
              </h1>
              <p style={{ fontSize: 14, color: "#cbd5e1", marginTop: 6, maxWidth: 540, lineHeight: 1.5 }}>
                Manage, search, and audit user profiles across your organization with ease.
              </p>
            </div>

            <div style={{ flexShrink: 0 }}>
              <Link
                to="/create-profile"
                className="inline-flex items-center justify-center"
                style={{
                  gap: 8,
                  backgroundColor: "#ffffff",
                  color: "#312e81",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "12px 24px",
                  borderRadius: 12,
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s",
                }}
              >
                <UserPlus style={{ width: 18, height: 18, color: "#4f46e5" }} />
                Create New Profile
              </Link>
            </div>
          </div>
        </div>

        {/* ═══════════ STATS OVERVIEW CARDS ═══════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {/* Card 1: Total Users */}
          <div className="saas-card" style={{ padding: "20px 24px" }}>
            <div className="flex items-center justify-between">
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Total Profiles
                </span>
                <div className="flex items-baseline" style={{ gap: 8, marginTop: 4 }}>
                  <h3 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", fontFamily: "Poppins" }}>
                    {users.length}
                  </h3>
                  <span className="badge-emerald" style={{ fontSize: 11 }}>Active</span>
                </div>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#eef2ff", border: "1px solid #c7d2fe", color: "#4f46e5" }}
              >
                <Users style={{ width: 22, height: 22 }} />
              </div>
            </div>
          </div>

          {/* Card 2: Roles Count */}
          <div className="saas-card" style={{ padding: "20px 24px" }}>
            <div className="flex items-center justify-between">
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Unique Roles
                </span>
                <div className="flex items-baseline" style={{ gap: 8, marginTop: 4 }}>
                  <h3 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", fontFamily: "Poppins" }}>
                    {rolesCount}
                  </h3>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Categories</span>
                </div>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", color: "#047857" }}
              >
                <Briefcase style={{ width: 22, height: 22 }} />
              </div>
            </div>
          </div>

          {/* Card 3: Skills Count */}
          <div className="saas-card" style={{ padding: "20px 24px" }}>
            <div className="flex items-center justify-between">
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Indexed Skills
                </span>
                <div className="flex items-baseline" style={{ gap: 8, marginTop: 4 }}>
                  <h3 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", fontFamily: "Poppins" }}>
                    {totalSkillsCount}
                  </h3>
                  <span className="badge-indigo" style={{ fontSize: 11 }}>Tags</span>
                </div>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#f3e8ff", border: "1px solid #e9d5ff", color: "#7e22ce" }}
              >
                <Code2 style={{ width: 22, height: 22 }} />
              </div>
            </div>
          </div>

          {/* Card 4: Cloudinary Media Assets */}
          <div className="saas-card" style={{ padding: "20px 24px" }}>
            <div className="flex items-center justify-between">
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Cloudinary Media
                </span>
                <div className="flex items-baseline" style={{ gap: 8, marginTop: 4 }}>
                  <h3 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", fontFamily: "Poppins" }}>
                    {mediaCount}
                  </h3>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Photos</span>
                </div>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#fffbeb", border: "1px solid #fde68a", color: "#b45309" }}
              >
                <HardDrive style={{ width: 22, height: 22 }} />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ TOOLBAR: SEARCH & FILTER ═══════════ */}
        <div className="flex flex-col sm:flex-row items-center justify-between" style={{ gap: 16, marginBottom: 24 }}>
          {/* Search Input */}
          <div className="relative w-full" style={{ maxWidth: 420 }}>
            <Search style={{ width: 18, height: 18, position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search by name, role, email, skill..."
              className="saas-input"
              style={{ paddingLeft: 42, paddingRight: 36, height: 44, borderRadius: 12 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 12,
                  color: "#94a3b8",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center justify-between w-full sm:w-auto" style={{ gap: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
              Showing <span style={{ color: "#0f172a", fontWeight: 800 }}>{filteredUsers.length}</span> profiles
            </span>

            <div className="flex items-center" style={{ gap: 10 }}>
              <button
                onClick={fetchUsers}
                className="saas-button-secondary"
                style={{ padding: "8px 12px", borderRadius: 10, fontSize: 13 }}
                title="Refresh List"
              >
                <RefreshCw style={{ width: 16, height: 16 }} className={loading ? "spinner" : ""} />
              </button>

              {/* View Switcher */}
              <div className="flex items-center" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 3 }}>
                <button
                  onClick={() => setViewMode("grid")}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: viewMode === "grid" ? "#eef2ff" : "transparent",
                    color: viewMode === "grid" ? "#4f46e5" : "#94a3b8",
                    fontWeight: 700,
                  }}
                  title="Grid View"
                >
                  <LayoutGrid style={{ width: 16, height: 16 }} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: viewMode === "table" ? "#eef2ff" : "transparent",
                    color: viewMode === "table" ? "#4f46e5" : "#94a3b8",
                    fontWeight: 700,
                  }}
                  title="Table View"
                >
                  <List style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ CONTENT SECTION ═══════════ */}
        {loading ? (
          /* SKELETON SHIMMER LOADERS */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="saas-card" style={{ padding: 24 }}>
                <div className="flex items-center" style={{ gap: 14, marginBottom: 16 }}>
                  <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 16 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="skeleton" style={{ height: 16, width: "70%", borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 12, width: "45%", borderRadius: 4 }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                  <div className="skeleton" style={{ height: 12, width: "90%", borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 12, width: "60%", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          /* EMPTY STATE */
          <div className="saas-card" style={{ padding: "64px 32px", textAlign: "center", maxWidth: 480, margin: "48px auto" }}>
            <div
              className="flex items-center justify-center"
              style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "#eef2ff", color: "#4f46e5", margin: "0 auto 16px", border: "1px solid #c7d2fe" }}
            >
              <Users style={{ width: 32, height: 32 }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", fontFamily: "Poppins", marginBottom: 6 }}>
              {searchTerm ? "No Matching Profiles Found" : "No User Profiles Yet"}
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>
              {searchTerm
                ? `No user profiles matched "${searchTerm}". Try searching another keyword.`
                : "Get started by adding your first user profile to the HireVeda platform."}
            </p>
            {!searchTerm && (
              <Link to="/create-profile" className="saas-button-primary" style={{ padding: "12px 24px", textDecoration: "none" }}>
                <UserPlus style={{ width: 16, height: 16 }} /> Add First Profile
              </Link>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* ═══ GRID VIEW ═══ */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="saas-card saas-card-hover"
                style={{ padding: 24, display: "flex", flexDirection: "column", justifyBetween: "space-between" }}
              >
                <div>
                  {/* Card Profile Header */}
                  <div className="flex items-start" style={{ gap: 14, marginBottom: 16 }}>
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={`${user.basicInfo?.firstName}`}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          objectFit: "cover",
                          border: "2px solid #e0e7ff",
                          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.12)",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          background: "linear-gradient(135deg, #4f46e5, #4338ca)",
                          color: "#ffffff",
                          fontWeight: 800,
                          fontFamily: "Poppins",
                          fontSize: 18,
                          flexShrink: 0,
                          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
                        }}
                      >
                        {getInitials(user.basicInfo?.firstName, user.basicInfo?.lastName)}
                      </div>
                    )}

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.basicInfo?.firstName} {user.basicInfo?.lastName}
                      </h3>
                      {user.professional?.currentRole ? (
                        <p className="flex items-center" style={{ fontSize: 13, color: "#4f46e5", fontWeight: 700, gap: 4, marginTop: 2 }}>
                          <Briefcase style={{ width: 14, height: 14 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user.professional.currentRole}
                          </span>
                        </p>
                      ) : (
                        <span style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, display: "block" }}>Profile Active</span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                    <div className="flex items-center" style={{ gap: 8, fontSize: 13, color: "#475569" }}>
                      <Mail style={{ width: 15, height: 15, color: "#94a3b8", flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.basicInfo?.email}
                      </span>
                    </div>

                    {user.basicInfo?.location && (
                      <div className="flex items-center" style={{ gap: 8, fontSize: 13, color: "#475569" }}>
                        <MapPin style={{ width: 15, height: 15, color: "#94a3b8", flexShrink: 0 }} />
                        <span>{user.basicInfo.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills Tags */}
                  {user.professional?.skills?.length > 0 && (
                    <div className="flex flex-wrap" style={{ gap: 6, marginTop: 14 }}>
                      {user.professional.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="badge-indigo">
                          {skill}
                        </span>
                      ))}
                      {user.professional.skills.length > 3 && (
                        <span className="badge-slate">
                          +{user.professional.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center" style={{ gap: 8, paddingTop: 16, marginTop: 16, borderTop: "1px solid #f1f5f9" }}>
                  <Link to={`/profile/${user._id}`} className="saas-button-secondary" style={{ flex: 1, padding: "8px 0", fontSize: 13, textDecoration: "none" }}>
                    <Eye style={{ width: 14, height: 14 }} /> View
                  </Link>
                  <Link to={`/edit-profile/${user._id}`} className="saas-button-secondary" style={{ flex: 1, padding: "8px 0", fontSize: 13, textDecoration: "none" }}>
                    <Edit style={{ width: 14, height: 14 }} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id, `${user.basicInfo?.firstName} ${user.basicInfo?.lastName}`)}
                    disabled={deleteLoading === user._id}
                    style={{
                      padding: 8,
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#ffffff",
                      color: "#64748b",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    title="Delete User"
                  >
                    {deleteLoading === user._id ? (
                      <RefreshCw style={{ width: 16, height: 16 }} className="spinner" />
                    ) : (
                      <Trash2 style={{ width: 16, height: 16 }} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ═══ TABLE VIEW ═══ */
          <div className="saas-card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13, color: "#334155" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <th style={{ padding: "14px 20px" }}>User</th>
                    <th style={{ padding: "14px 20px" }}>Role & Experience</th>
                    <th style={{ padding: "14px 20px" }}>Location</th>
                    <th style={{ padding: "14px 20px" }}>Skills</th>
                    <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div className="flex items-center" style={{ gap: 12 }}>
                          {user.profileImage ? (
                            <img src={user.profileImage} alt="" style={{ width: 38, height: 38, borderRadius: 10, objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#4f46e5", color: "#ffffff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyCenter: "center" }}>
                              {getInitials(user.basicInfo?.firstName, user.basicInfo?.lastName)}
                            </div>
                          )}
                          <div>
                            <p style={{ fontWeight: 700, color: "#0f172a" }}>
                              {user.basicInfo?.firstName} {user.basicInfo?.lastName}
                            </p>
                            <p style={{ fontSize: 12, color: "#64748b" }}>{user.basicInfo?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <p style={{ fontWeight: 700, color: "#0f172a" }}>{user.professional?.currentRole || "N/A"}</p>
                        <p style={{ fontSize: 12, color: "#64748b" }}>{user.professional?.yearsOfExperience || 0} yrs exp</p>
                      </td>
                      <td style={{ padding: "14px 20px" }}>{user.basicInfo?.location || "N/A"}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <div className="flex flex-wrap" style={{ gap: 4 }}>
                          {(user.professional?.skills || []).slice(0, 2).map((s, i) => (
                            <span key={i} className="badge-indigo">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <div className="flex items-center justify-end" style={{ gap: 8 }}>
                          <Link to={`/profile/${user._id}`} style={{ padding: 6, color: "#4f46e5", textDecoration: "none" }} title="View">
                            <Eye style={{ width: 16, height: 16 }} />
                          </Link>
                          <Link to={`/edit-profile/${user._id}`} style={{ padding: 6, color: "#4f46e5", textDecoration: "none" }} title="Edit">
                            <Edit style={{ width: 16, height: 16 }} />
                          </Link>
                          <button onClick={() => handleDelete(user._id, `${user.basicInfo?.firstName} ${user.basicInfo?.lastName}`)} style={{ padding: 6, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }} title="Delete">
                            <Trash2 style={{ width: 16, height: 16 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
