import { useNavigate, useLocation } from "react-router-dom";
import { success } from "../Utils/notification";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logoutAPI } from "../Redux/authentication/auth.action";
import { FaBus, FaHome, FaTicketAlt, FaUserCircle, FaSignOutAlt, FaRobot, FaInfoCircle, FaQuestionCircle, FaChartLine } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth?.data?.token) || Cookies.get("jwttoken");
  const userEmail = Cookies.get("useremail") || Cookies.get("userid") || "Passenger";

  const handlelogout = () => {
    Cookies.remove("jwttoken");
    Cookies.remove("userid");
    Cookies.remove("usergender");
    Cookies.remove("useremail");
    dispatch(logoutAPI());
    navigate("/");
    success("Logged out successfully");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #091e42 0%, #0d2f6c 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        padding: "10px 0",
      }}
      className="navbar navbar-expand-lg navbar-dark"
    >
      <div className="container-fluid" style={{ maxWidth: "1240px", margin: "auto", padding: "0 20px" }}>
        {/* Brand Logo */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(56, 189, 248, 0.35)",
            }}
          >
            <FaBus style={{ color: "#ffffff", fontSize: "20px" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <span style={{ fontSize: "22px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
                Blue
              </span>
              <span style={{ fontSize: "22px", fontWeight: "900", color: "#38bdf8", letterSpacing: "-0.5px" }}>
                Bus
              </span>
            </div>
            <small style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)", display: "block", marginTop: "-3px", fontWeight: "600", letterSpacing: "0.5px" }}>
              EXPRESS TRAVELS
            </small>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links & User Actions */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ marginLeft: "30px", gap: "8px" }}>
            <li className="nav-item">
              <span
                onClick={() => navigate("/")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  color: isActive("/") ? "#ffffff" : "rgba(255,255,255,0.75)",
                  backgroundColor: isActive("/") ? "rgba(255,255,255,0.12)" : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <FaHome style={{ fontSize: "16px", color: isActive("/") ? "#38bdf8" : "inherit" }} /> Home
              </span>
            </li>
            <li className="nav-item">
              <span
                onClick={() => navigate("/myticket")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  color: isActive("/myticket") ? "#ffffff" : "rgba(255,255,255,0.75)",
                  backgroundColor: isActive("/myticket") ? "rgba(255,255,255,0.12)" : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <FaTicketAlt style={{ fontSize: "15px", color: isActive("/myticket") ? "#38bdf8" : "inherit" }} /> My Tickets
              </span>
            </li>
            <li className="nav-item">
              <span
                onClick={() => navigate("/management")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  color: isActive("/management") ? "#ffffff" : "#38bdf8",
                  backgroundColor: isActive("/management") ? "rgba(56, 189, 248, 0.2)" : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                <FaChartLine style={{ fontSize: "14px" }} /> AI Console
                <span
                  style={{
                    backgroundColor: "#38bdf8",
                    color: "#0f172a",
                    fontSize: "10px",
                    fontWeight: "900",
                    padding: "1px 6px",
                    borderRadius: "10px",
                  }}
                >
                  Seq 8-15
                </span>
              </span>
            </li>
            <li className="nav-item">
              <span
                onClick={() => window.dispatchEvent(new CustomEvent("open-footer-modal", { detail: { key: "about" } }))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.75)",
                  backgroundColor: "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <FaInfoCircle style={{ fontSize: "15px" }} /> About
              </span>
            </li>
            <li className="nav-item">
              <span
                onClick={() => window.dispatchEvent(new CustomEvent("open-footer-modal", { detail: { key: "faq" } }))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.75)",
                  backgroundColor: "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <FaQuestionCircle style={{ fontSize: "14px" }} /> Info &amp; FAQ
              </span>
            </li>
          </ul>

          {/* Right Action Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {token ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    padding: "6px 14px",
                    borderRadius: "30px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <FaUserCircle style={{ color: "#38bdf8", fontSize: "18px" }} />
                  <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: "600" }}>
                    Account Active
                  </span>
                </div>
                <button
                  onClick={handlelogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "9px 20px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
                  transition: "all 0.2s ease",
                }}
              >
                <FaUserCircle style={{ fontSize: "16px" }} /> Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
