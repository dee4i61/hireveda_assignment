import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserPlus,
  LogOut,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getAdminInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.02)",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64 }}
      >
        {/* Brand Logo */}
        <div className="flex items-center" style={{ gap: 12 }}>
          <Link to="/dashboard" className="flex items-center" style={{ gap: 10, textDecoration: "none" }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #4f46e5, #4338ca)",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
              }}
            >
              <Sparkles style={{ width: 18, height: 18 }} />
            </div>
            <div className="flex flex-col">
              <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1.1, fontFamily: "Poppins" }}>
                Hire<span style={{ color: "#4f46e5" }}>Veda</span>
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Admin Portal
              </span>
            </div>
          </Link>

          <span
            className="hidden sm:inline-flex items-center"
            style={{
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "#047857",
              backgroundColor: "#ecfdf5",
              border: "1px solid #a7f3d0",
              padding: "2px 10px",
              borderRadius: 9999,
              marginLeft: 8,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#10b981" }} />
            System Active
          </span>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center" style={{ gap: 8 }}>
          <Link
            to="/dashboard"
            className="flex items-center"
            style={{
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              padding: "8px 14px",
              borderRadius: 8,
              textDecoration: "none",
              backgroundColor: location.pathname === "/dashboard" ? "#eef2ff" : "transparent",
              color: location.pathname === "/dashboard" ? "#4f46e5" : "#475569",
              transition: "all 0.2s",
            }}
          >
            <LayoutDashboard style={{ width: 16, height: 16 }} />
            Dashboard
          </Link>
        </nav>

        {/* Admin & Logout */}
        <div className="flex items-center" style={{ gap: 12 }}>
          {/* Admin User Info Pill */}
          <div
            className="hidden sm:flex items-center"
            style={{
              gap: 10,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: "6px 12px",
              borderRadius: 10,
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {getAdminInitials(adminData.name)}
            </div>
            <div className="flex flex-col text-left">
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.1 }}>
                {adminData.name || "Admin"}
              </span>
              <span style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>Administrator</span>
            </div>
          </div>

          {/* Add User Action Button */}
          {location.pathname !== "/create-profile" && (
            <Link
              to="/create-profile"
              className="saas-button-primary"
              style={{ padding: "8px 16px", fontSize: 13, textDecoration: "none", borderRadius: 10 }}
            >
              <UserPlus style={{ width: 16, height: 16 }} />
              <span className="hidden sm:inline">Add Profile</span>
            </Link>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              color: "#64748b",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            title="Logout"
          >
            <LogOut style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
