import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaBus, FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";
import { loginAPI } from "../Redux/authentication/auth.action";
import { error } from "../Utils/notification";

function Signin() {
  const isAuthenticated = useSelector((state) => state.auth?.data?.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [creds, setCreds] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (location.state && location.state.from) {
        navigate(location.state.from, { replace: true });
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreds((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const email = creds.email.trim();
    const password = creds.password.trim();

    if (!email || !password) {
      return error("Please enter both your email and password");
    }

    setLoading(true);
    try {
      await dispatch(loginAPI({ email, password }, navigate));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        padding: "40px 15px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#ffffff",
          borderRadius: "18px",
          boxShadow: "0 16px 40px rgba(13, 47, 108, 0.12)",
          border: "1px solid #e2e8f0",
          padding: "35px 30px",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          {/* Sequence 01 Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#eff6ff",
              color: "#1e40af",
              border: "1px solid #bfdbfe",
              fontSize: "11px",
              fontWeight: "800",
              padding: "4px 12px",
              borderRadius: "16px",
              marginBottom: "12px",
              letterSpacing: "0.4px",
            }}
          >
            <span>🤖</span> SEQUENCE 01: PASSENGER LOGIN &bull; AI ASSISTANT
          </div>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
                color: "#ffffff",
                fontSize: "24px",
                boxShadow: "0 6px 18px rgba(56, 189, 248, 0.4)",
                marginBottom: "10px",
              }}
            >
              <FaBus />
            </div>
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>
            Welcome Back
          </h2>
          <p style={{ color: "#64748b", fontSize: "13.5px", margin: 0 }}>
            Sign in to access your booked tickets, travel history, and AI assistant.
          </p>
        </div>

        {/* 1-Click Demo Accounts Quick-Fill for Fast Evaluation */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px dashed #cbd5e1",
            borderRadius: "10px",
            padding: "10px 12px",
            marginBottom: "16px",
          }}
        >
          <small
            style={{
              display: "block",
              color: "#475569",
              fontSize: "11px",
              fontWeight: "800",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            ⚡ 1-Click Instant Demo Login:
          </small>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => {
                setCreds({ email: "audit.seq@gmail.com", password: "password123" });
              }}
              style={{
                background: "#ffffff",
                border: "1px solid #93c5fd",
                color: "#1d4ed8",
                fontSize: "11.5px",
                fontWeight: "700",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              👤 Pooja Sharma (Pune &rarr; Jalgaon)
            </button>
            <button
              type="button"
              onClick={() => {
                setCreds({ email: "raju.rastogi@gmail.com", password: "password123" });
              }}
              style={{
                background: "#ffffff",
                border: "1px solid #93c5fd",
                color: "#1d4ed8",
                fontSize: "11.5px",
                fontWeight: "700",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              👤 Raju Rastogi
            </button>
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              <FaEnvelope style={{ color: "#2563eb", fontSize: "13px" }} /> Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={creds.email}
              onChange={handleChange}
              style={{
                fontSize: "14px",
                fontWeight: "600",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
              }}
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              <FaLock style={{ color: "#2563eb", fontSize: "13px" }} /> Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={creds.password}
                onChange={handleChange}
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "11px 40px 11px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                }}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #1446a0 0%, #1d4ed8 100%)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "800",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 18px rgba(20, 70, 160, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        {/* Security Note */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginTop: "16px",
            color: "#64748b",
            fontSize: "12px",
          }}
        >
          <FaShieldAlt style={{ color: "#10b981" }} /> 256-bit SSL encrypted secure authentication.
        </div>

        {/* Link to Sign Up */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px dashed #e2e8f0",
            fontSize: "14px",
            color: "#475569",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#1446a0",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Create one now &rarr;
          </Link>
        </div>

        {/* Sequence 1: AI Chatbot Assistant Link */}
        <div style={{ textAlign: "center", marginTop: "14px" }}>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-bluebot", {
                  detail: { initialQuery: "Hi BlueBot! I need help logging into my BlueBus account." },
                })
              )
            }
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "20px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "700",
              color: "#1e40af",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🤖 Need Help Signing In? Ask BlueBot AI &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
