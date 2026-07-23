import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginAdmin } from "../services/adminService";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginAdmin(data);
      const adminInfo = res.data;
      localStorage.setItem("adminToken", adminInfo.token);
      localStorage.setItem("adminData", JSON.stringify(adminInfo));
      toast.success("Welcome back, Admin!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fafafc",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      {/* Background Decorative Blur Orbs */}
      <div
        style={{
          position: "absolute",
          top: -150,
          right: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="animate-fadeInUp"
        style={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "linear-gradient(135deg, #4f46e5, #4338ca)",
              color: "#ffffff",
              margin: "0 auto 20px",
              boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)",
            }}
          >
            <Sparkles style={{ width: 32, height: 32 }} />
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Welcome to Hire<span style={{ color: "#4f46e5" }}>Veda</span>
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 6, fontWeight: 500 }}>
            Sign in to access user management portal
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="saas-card"
          style={{
            padding: "36px 32px",
            borderRadius: 20,
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.05)",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Email Field */}
            <div>
              <label className="saas-label" style={{ marginBottom: 6 }}>
                Admin Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    width: 18,
                    height: 18,
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  className="saas-input"
                  style={{ paddingLeft: 42, height: 46, fontSize: 14 }}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 500, marginTop: 4 }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="saas-label" style={{ marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    width: 18,
                    height: 18,
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="saas-input"
                  style={{ paddingLeft: 42, paddingRight: 44, height: 46, fontSize: 14 }}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 500, marginTop: 4 }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="saas-button-primary"
              style={{ marginTop: 8, height: 46, fontSize: 14, fontWeight: 700 }}
            >
              {loading ? "Signing in..." : "Sign In to Console"}
            </button>
          </form>

          {/* Switch to Register */}
          <div style={{ marginTop: 28, textAlign: "center", fontSize: 13, color: "#64748b" }}>
            Don't have an admin account?{" "}
            <Link to="/register" style={{ fontWeight: 700, color: "#4f46e5", textDecoration: "none" }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
