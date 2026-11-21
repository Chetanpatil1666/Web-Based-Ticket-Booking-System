import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import axios from "axios";
import {
  FaBus,
  FaRoute,
  FaChartLine,
  FaUserTie,
  FaUsers,
  FaSmile,
  FaMeh,
  FaFrown,
  FaShieldAlt,
  FaClock,
  FaCalendarAlt,
  FaTachometerAlt,
  FaGasPump,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPercent,
  FaSearch,
  FaStar,
  FaTags,
  FaDollarSign,
  FaMoneyBillWave,
  FaEnvelope,
  FaWhatsapp,
  FaSms,
  FaLock,
  FaBug,
  FaSyncAlt,
  FaRobot,
  FaCheck,
  FaCopy,
  FaPaperPlane,
  FaMobileAlt,
  FaTicketAlt,
} from "react-icons/fa";

function Management() {
  const [activeTab, setActiveTab] = useState("demand");
  const [loading, setLoading] = useState(false);

  // Sequence 8: AI Demand Prediction State
  const [demandRoute, setDemandRoute] = useState("Mumbai ➔ Bengaluru");
  const [demandDate, setDemandDate] = useState(new Date().toISOString().split("T")[0]);
  const [demandResult, setDemandResult] = useState(null);

  // Sequence 9: AI Route Demand & Driver State
  const [driverRoster, setDriverRoster] = useState([]);
  const [routeAnalysis, setRouteAnalysis] = useState(null);

  // Sequence 10: AI Sentiment Analysis State
  const [sentimentData, setSentimentData] = useState(null);

  // Sequence 11: Smart Dynamic Pricing State
  const [pricingRoute, setPricingRoute] = useState("Mumbai ➔ Bengaluru");
  const [pricingBase, setPricingBase] = useState(1600);
  const [pricingOccupancy, setPricingOccupancy] = useState(85);
  const [pricingDays, setPricingDays] = useState(2);
  const [pricingData, setPricingData] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  // Sequence 12: AI Revenue Forecasting State
  const [forecastPeriod, setForecastPeriod] = useState("30days");
  const [revenueData, setRevenueData] = useState(null);

  // Sequence 13: AI Personalized Notifications State
  const [selectedProfile, setSelectedProfile] = useState("pooja"); // "pooja" (solo female) or "raju" (business)
  const [notifData, setNotifData] = useState(null);
  const [dispatchedToast, setDispatchedToast] = useState(false);

  // Sequence 14: AI Review Summarization State
  const [summaryRoute, setSummaryRoute] = useState("Mumbai ➔ Bengaluru");
  const [reviewSummaryData, setReviewSummaryData] = useState(null);

  // Sequence 15: Security & Anomaly Detection State
  const [securityData, setSecurityData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Global Management Overview
  const [overviewStats, setOverviewStats] = useState({
    activeFleetBuses: 396,
    totalBookingsProcessed: 24,
    onTimePerformance: "98.6%",
    passengerSatisfactionScore: "94.6%",
    activeCorridors: 19,
    projectedMonthlyRevenue: "₹ 56,20,000",
    systemThreatLevel: "SECURE (0 Anomalies)",
    dynamicPricingYield: "+12.4%",
  });

  useEffect(() => {
    fetchOverview();
    runDemandPrediction("Mumbai", "Bengaluru");
    runRouteDemandAnalysis("Mumbai ➔ Bengaluru");
    runSentimentAnalysis();
    runDynamicPricing("Mumbai ➔ Bengaluru", 1600, 85, 2);
    fetchRevenueForecast("30days");
    fetchPersonalizedNotification("pooja");
    fetchReviewSummary("Mumbai ➔ Bengaluru");
    fetchSecurityAudit();
  }, []);

  async function fetchOverview() {
    try {
      const res = await axios.get(`${API_BASE_URL}/ai/management-overview`);
      if (res.data?.stats) {
        setOverviewStats(res.data.stats);
      }
    } catch (e) {}
  }

  // Seq 8
  async function runDemandPrediction(from, to) {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/demand-prediction`, {
        from: from || demandRoute.split("➔")[0].trim(),
        to: to || demandRoute.split("➔")[1].trim(),
        date: demandDate,
      });
      if (res.data) setDemandResult(res.data);
    } catch (e) {
      console.error("Demand prediction error:", e);
    } finally {
      setLoading(false);
    }
  }

  // Seq 9
  async function runRouteDemandAnalysis(route) {
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/route-demand-analysis`, {
        route: route || demandRoute,
      });
      if (res.data) {
        setRouteAnalysis(res.data.routeAnalysis);
        setDriverRoster(res.data.driverRoster || []);
      }
    } catch (e) {
      console.error("Route analysis error:", e);
    }
  }

  // Seq 10
  async function runSentimentAnalysis() {
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/sentiment-analysis`, {});
      if (res.data) setSentimentData(res.data);
    } catch (e) {
      console.error("Sentiment analysis error:", e);
    }
  }

  // Seq 11
  async function runDynamicPricing(route, base, occ, days) {
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/dynamic-pricing`, {
        route: route || pricingRoute,
        basePrice: base !== undefined ? base : pricingBase,
        occupancyRate: occ !== undefined ? occ : pricingOccupancy,
        daysUntilDeparture: days !== undefined ? days : pricingDays,
      });
      if (res.data) setPricingData(res.data);
    } catch (e) {
      console.error("Dynamic pricing error:", e);
    }
  }

  // Seq 12
  async function fetchRevenueForecast(period) {
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/revenue-forecast`, {
        period: period || forecastPeriod,
      });
      if (res.data?.forecast) setRevenueData(res.data.forecast);
    } catch (e) {
      console.error("Revenue forecast error:", e);
    }
  }

  // Seq 13
  async function fetchPersonalizedNotification(profile) {
    const isPooja = profile === "pooja";
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/personalized-notification`, {
        passengerName: isPooja ? "Pooja Sharma" : "Raju Rastogi",
        gender: isPooja ? "female" : "male",
        route: "Mumbai ➔ Bengaluru",
        departureTime: isPooja ? "21:00" : "20:30",
        seatNumber: isPooja ? "Seat 6 (Ladies Reserved Berth)" : "Seat 3 (Pushback AC)",
        passengerType: isPooja ? "solo_female" : "business_commuter",
      });
      if (res.data) setNotifData(res.data);
    } catch (e) {
      console.error("Notification error:", e);
    }
  }

  function handleDispatchNotification() {
    setDispatchedToast(true);
    setTimeout(() => setDispatchedToast(false), 4000);
  }

  // Seq 14
  async function fetchReviewSummary(route) {
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/summarize-reviews`, {
        route: route || summaryRoute,
        operator: "Orange Travels Gold Class",
      });
      if (res.data?.summary) setReviewSummaryData(res.data.summary);
    } catch (e) {
      console.error("Review summary error:", e);
    }
  }

  // Seq 15
  async function fetchSecurityAudit() {
    try {
      const res = await axios.get(`${API_BASE_URL}/ai/security-audit`);
      if (res.data?.telemetry) setSecurityData(res.data.telemetry);
    } catch (e) {
      console.error("Security audit error:", e);
    }
  }

  async function handleAnomalyScan() {
    setIsScanning(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/scan-anomalies`, {});
      if (res.data) setScanResult(res.data);
    } catch (e) {
      console.error("Scan error:", e);
    } finally {
      setTimeout(() => setIsScanning(false), 800);
    }
  }

  return (
    <div style={{ maxWidth: "1320px", margin: "auto", padding: "24px 20px" }}>
      {/* Top Banner Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #091e42 0%, #1e3a8a 100%)",
          borderRadius: "18px",
          padding: "26px 30px",
          color: "#ffffff",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span
              style={{
                backgroundColor: "#38bdf8",
                color: "#0f172a",
                fontSize: "11px",
                fontWeight: "900",
                padding: "3px 10px",
                borderRadius: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Enterprise Operations Suite
            </span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
              ⚡ Sequences 8 to 15 Active &amp; Synchronized
            </span>
          </div>
          <h2 style={{ margin: 0, fontWeight: "900", fontSize: "28px", letterSpacing: "-0.5px" }}>
            Fleet, Revenue, Pricing &amp; Security AI Console
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
            Automated Demand Modeling, Dynamic Revenue Multipliers, Personalized Comm Channels &amp; Anomaly Shields
          </p>
        </div>

        {/* Live Quick Counters */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <small style={{ color: "rgba(255,255,255,0.75)", display: "block", fontSize: "11px", fontWeight: "700" }}>ACTIVE FLEET</small>
            <strong style={{ fontSize: "18px", color: "#38bdf8" }}>{overviewStats.activeFleetBuses} Buses</strong>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <small style={{ color: "rgba(255,255,255,0.75)", display: "block", fontSize: "11px", fontWeight: "700" }}>ON-TIME INDEX</small>
            <strong style={{ fontSize: "18px", color: "#4ade80" }}>{overviewStats.onTimePerformance}</strong>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <small style={{ color: "rgba(255,255,255,0.75)", display: "block", fontSize: "11px", fontWeight: "700" }}>MONTHLY FORECAST</small>
            <strong style={{ fontSize: "18px", color: "#facc15" }}>{overviewStats.projectedMonthlyRevenue}</strong>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <small style={{ color: "rgba(255,255,255,0.75)", display: "block", fontSize: "11px", fontWeight: "700" }}>SECURITY SHIELD</small>
            <strong style={{ fontSize: "18px", color: "#34d399" }}>0 Threats Detected</strong>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation (Sequences 8 to 15) */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "2px solid #e2e8f0",
          marginBottom: "24px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}
      >
        <button
          onClick={() => setActiveTab("demand")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            fontSize: "13.5px",
            fontWeight: "800",
            border: "none",
            borderBottom: activeTab === "demand" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "demand" ? "#eff6ff" : "transparent",
            color: activeTab === "demand" ? "#1e40af" : "#64748b",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            whiteSpace: "nowrap",
          }}
        >
          <FaRoute /> 1. Routes (Seq 8)
        </button>

        <button
          onClick={() => setActiveTab("drivers")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            fontSize: "13.5px",
            fontWeight: "800",
            border: "none",
            borderBottom: activeTab === "drivers" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "drivers" ? "#eff6ff" : "transparent",
            color: activeTab === "drivers" ? "#1e40af" : "#64748b",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            whiteSpace: "nowrap",
          }}
        >
          <FaUserTie /> 2. Drivers &amp; Fleet (Seq 9)
        </button>

        <button
          onClick={() => setActiveTab("sentiment")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            fontSize: "13.5px",
            fontWeight: "800",
            border: "none",
            borderBottom: activeTab === "sentiment" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "sentiment" ? "#eff6ff" : "transparent",
            color: activeTab === "sentiment" ? "#1e40af" : "#64748b",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            whiteSpace: "nowrap",
          }}
        >
          <FaSmile /> 3. Sentiment NLP (Seq 10)
        </button>

        <button
          onClick={() => setActiveTab("pricing")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            fontSize: "13.5px",
            fontWeight: "800",
            border: "none",
            borderBottom: activeTab === "pricing" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "pricing" ? "#eff6ff" : "transparent",
            color: activeTab === "pricing" ? "#1e40af" : "#64748b",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            whiteSpace: "nowrap",
          }}
        >
          <FaTags /> 4. Dynamic Pricing (Seq 11)
        </button>

        <button
          onClick={() => setActiveTab("revenue")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            fontSize: "13.5px",
            fontWeight: "800",
            border: "none",
            borderBottom: activeTab === "revenue" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "revenue" ? "#eff6ff" : "transparent",
            color: activeTab === "revenue" ? "#1e40af" : "#64748b",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            whiteSpace: "nowrap",
          }}
        >
          <FaChartLine /> 5. Revenue Forecast (Seq 12)
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            fontSize: "13.5px",
            fontWeight: "800",
            border: "none",
            borderBottom: activeTab === "notifications" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "notifications" ? "#eff6ff" : "transparent",
            color: activeTab === "notifications" ? "#1e40af" : "#64748b",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            whiteSpace: "nowrap",
          }}
        >
          <FaEnvelope /> 6. Smart Notifications (Seq 13)
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            fontSize: "13.5px",
            fontWeight: "800",
            border: "none",
            borderBottom: activeTab === "reviews" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "reviews" ? "#eff6ff" : "transparent",
            color: activeTab === "reviews" ? "#1e40af" : "#64748b",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            whiteSpace: "nowrap",
          }}
        >
          <FaStar /> 7. Review Summarizer (Seq 14)
        </button>

        <button
          onClick={() => setActiveTab("security")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            fontSize: "13.5px",
            fontWeight: "800",
            border: "none",
            borderBottom: activeTab === "security" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "security" ? "#eff6ff" : "transparent",
            color: activeTab === "security" ? "#1e40af" : "#64748b",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            whiteSpace: "nowrap",
          }}
        >
          <FaShieldAlt /> 8. Security &amp; Anomaly (Seq 15)
        </button>
      </div>

      {/* ================= TAB 1: SEQUENCE 8 - AI DEMAND PREDICTION ================= */}
      {activeTab === "demand" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Interactive Route Selector Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px 24px",
              borderRadius: "16px",
              border: "1.5px solid #cbd5e1",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div>
              <h5 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                AI Route Demand &amp; Occupancy Predictor
              </h5>
              <small style={{ color: "#64748b" }}>
                Select an intercity transit corridor to run real-time AI passenger volume simulation
              </small>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <select
                value={demandRoute}
                onChange={(e) => {
                  setDemandRoute(e.target.value);
                  const [from, to] = e.target.value.split("➔").map((s) => s.trim());
                  runDemandPrediction(from, to);
                  runRouteDemandAnalysis(e.target.value);
                }}
                style={{
                  padding: "9px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#1e293b",
                  backgroundColor: "#f8fafc",
                }}
              >
                <option value="Mumbai ➔ Bengaluru">Mumbai ➔ Bengaluru</option>
                <option value="Mumbai ➔ Pune">Mumbai ➔ Pune</option>
                <option value="Delhi ➔ Jaipur">Delhi ➔ Jaipur</option>
                <option value="Bengaluru ➔ Hyderabad">Bengaluru ➔ Hyderabad</option>
                <option value="Bengaluru ➔ Chennai">Bengaluru ➔ Chennai</option>
              </select>

              <input
                type="date"
                value={demandDate}
                onChange={(e) => {
                  setDemandDate(e.target.value);
                  runDemandPrediction();
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: "#f8fafc",
                }}
              />

              <button
                onClick={() => runDemandPrediction()}
                disabled={loading}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px 20px",
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: "pointer",
                }}
              >
                {loading ? "Analyzing..." : "Re-Calculate Demand"}
              </button>
            </div>
          </div>

          {/* AI Demand Prediction Dashboard Cards */}
          {demandResult && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1.5px solid #bfdbfe",
                  background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#1e40af", textTransform: "uppercase" }}>
                    AI Demand Intensity
                  </span>
                  <FaChartLine style={{ color: "#2563eb", fontSize: "18px" }} />
                </div>
                <div style={{ fontSize: "36px", fontWeight: "900", color: "#1e3a8a", margin: "10px 0" }}>
                  {demandResult.demandScore}
                  <span style={{ fontSize: "18px", color: "#64748b" }}> / 100</span>
                </div>
                <div
                  style={{
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    fontWeight: "800",
                    fontSize: "12px",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    display: "inline-block",
                  }}
                >
                  🔥 {demandResult.demandLevel}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1.5px solid #bbf7d0",
                  background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#166534", textTransform: "uppercase" }}>
                    Forecasted Berth Occupancy
                  </span>
                  <FaPercent style={{ color: "#16a34a", fontSize: "18px" }} />
                </div>
                <div style={{ fontSize: "28px", fontWeight: "900", color: "#14532d", margin: "10px 0" }}>
                  {demandResult.occupancyForecast}
                </div>
                <small style={{ color: "#15803d", fontWeight: "700" }}>
                  {demandResult.activeCorridorBuses} Active Buses on this corridor
                </small>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1.5px solid #fde68a",
                  background: "linear-gradient(135deg, #ffffff 0%, #fefce8 100%)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#854d0e", textTransform: "uppercase" }}>
                    Recommended Fleet Surge
                  </span>
                  <FaBus style={{ color: "#ca8a04", fontSize: "18px" }} />
                </div>
                <p style={{ margin: "10px 0 0 0", fontSize: "13px", color: "#713f12", lineHeight: "1.5", fontWeight: "600" }}>
                  {demandResult.dispatchRecommendation}
                </p>
              </div>
            </div>
          )}

          {/* Popular Corridors Table */}
          {demandResult?.popularCorridors && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "20px 24px",
                border: "1.5px solid #cbd5e1",
              }}
            >
              <h5 style={{ fontWeight: "800", color: "#1e293b", marginBottom: "16px" }}>
                High-Volume Transit Corridors &amp; Peak Hour Surge Matrix
              </h5>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                {demandResult.popularCorridors.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "14px 16px",
                    }}
                  >
                    <div style={{ fontWeight: "800", color: "#1e40af", fontSize: "14px" }}>{c.route}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                      Peak Hours: <strong>{c.peakHours}</strong>
                    </div>
                    <div style={{ marginTop: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>
                        {c.fleetRecommendation}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                          padding: "2px 8px",
                          borderRadius: "10px",
                        }}
                      >
                        {c.surgeMultiplier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: SEQUENCE 9 - DRIVER & OPERATOR MANAGEMENT ================= */}
      {activeTab === "drivers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Route Safety & Operational Telemetry */}
          {routeAnalysis && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "22px 26px",
                border: "1.5px solid #cbd5e1",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h5 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                    AI Safety &amp; Route Telemetry: {routeAnalysis.route}
                  </h5>
                  <small style={{ color: "#64748b" }}>
                    Operator: <strong>{routeAnalysis.operatorName}</strong> &bull; GPS Tracking &amp; Driver Rest Compliance Telemetry
                  </small>
                </div>
                <span
                  style={{
                    backgroundColor: "#ecfdf5",
                    color: "#065f46",
                    border: "1px solid #a7f3d0",
                    fontWeight: "800",
                    fontSize: "12px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                  }}
                >
                  🛡️ {routeAnalysis.driverRestCompliance}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <small style={{ color: "#64748b", fontWeight: "700", display: "block" }}>ROUTE DIFFICULTY</small>
                  <strong style={{ color: "#1e293b", fontSize: "14px" }}>{routeAnalysis.difficultyIndex}</strong>
                </div>
                <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <small style={{ color: "#64748b", fontWeight: "700", display: "block" }}>TERRAIN ALERT</small>
                  <strong style={{ color: "#1e293b", fontSize: "14px" }}>{routeAnalysis.terrainAlerts}</strong>
                </div>
                <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <small style={{ color: "#64748b", fontWeight: "700", display: "block" }}>NIGHT-SHIFT RISK SCORE</small>
                  <strong style={{ color: "#15803d", fontSize: "14px" }}>{routeAnalysis.nightShiftRiskScore}</strong>
                </div>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  backgroundColor: "#eff6ff",
                  borderRadius: "10px",
                  border: "1px solid #bfdbfe",
                  fontSize: "13px",
                  color: "#1e40af",
                  fontWeight: "600",
                }}
              >
                💡 <strong>AI Operator Recommendation:</strong> {routeAnalysis.allocationAdvice}
              </div>
            </div>
          )}

          {/* Driver Roster Cards */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "20px 24px",
              border: "1.5px solid #cbd5e1",
            }}
          >
            <h5 style={{ fontWeight: "800", color: "#1e293b", marginBottom: "16px" }}>
              Active Commercial Drivers &amp; Real-time Fatigue Telemetry
            </h5>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              {driverRoster.map((d) => (
                <div
                  key={d.id}
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: "800", color: "#1e293b", fontSize: "16px" }}>{d.name}</div>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "800",
                        backgroundColor: d.status === "On Duty" ? "#dcfce7" : d.status === "Standby" ? "#e0f2fe" : "#fef3c7",
                        color: d.status === "On Duty" ? "#15803d" : d.status === "Standby" ? "#0369a1" : "#92400e",
                      }}
                    >
                      {d.status}
                    </span>
                  </div>

                  <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                    ID: <strong>{d.id}</strong> &bull; Experience: <strong>{d.experience}</strong> &bull; Assigned Coach: <strong>{d.assignedBus}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#b45309", fontWeight: "700", fontSize: "13px" }}>
                      <FaStar /> {d.safetyRating} Safety Rating
                    </div>
                    <span style={{ fontSize: "11.5px", color: "#475569", fontWeight: "700" }}>
                      Fatigue: {d.fatigueScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SEQUENCE 10 - PASSENGER REVIEW SENTIMENT ANALYSIS ================= */}
      {activeTab === "sentiment" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {sentimentData?.metrics && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1.5px solid #86efac",
                  background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#166534", textTransform: "uppercase" }}>
                  Customer Satisfaction Index
                </span>
                <div style={{ fontSize: "36px", fontWeight: "900", color: "#15803d", margin: "10px 0" }}>
                  {sentimentData.metrics.overallSatisfaction}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ backgroundColor: "#dcfce7", color: "#166534", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "10px" }}>
                    Positive: {sentimentData.metrics.sentimentDistribution.positive}
                  </span>
                  <span style={{ backgroundColor: "#fef9c3", color: "#854d0e", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "10px" }}>
                    Neutral: {sentimentData.metrics.sentimentDistribution.neutral}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1.5px solid #cbd5e1",
                  gridColumn: "span 2",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#475569", textTransform: "uppercase" }}>
                  Key Service Quality Dimensions
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginTop: "12px" }}>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <small style={{ color: "#64748b", display: "block" }}>Cleanliness &amp; Hygiene</small>
                    <strong style={{ color: "#15803d" }}>{sentimentData.metrics.aspectRatings.cleanlinessAndHygiene}</strong>
                  </div>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <small style={{ color: "#64748b", display: "block" }}>Punctuality &amp; Timing</small>
                    <strong style={{ color: "#15803d" }}>{sentimentData.metrics.aspectRatings.punctualityAndTiming}</strong>
                  </div>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <small style={{ color: "#64748b", display: "block" }}>Driver Safety &amp; Courtesy</small>
                    <strong style={{ color: "#15803d" }}>{sentimentData.metrics.aspectRatings.driverSafetyAndCourtesy}</strong>
                  </div>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <small style={{ color: "#64748b", display: "block" }}>Seat Comfort &amp; AC Cooling</small>
                    <strong style={{ color: "#15803d" }}>{sentimentData.metrics.aspectRatings.seatErgonomicsAndAC}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Executive Summary */}
          {sentimentData?.metrics?.aiExecutiveSummary && (
            <div
              style={{
                backgroundColor: "#eff6ff",
                border: "1.5px solid #93c5fd",
                borderRadius: "16px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div style={{ fontSize: "28px" }}>🤖</div>
              <div>
                <strong style={{ color: "#1e40af", fontSize: "14px", display: "block" }}>
                  AI Sentiment Executive Summary:
                </strong>
                <span style={{ color: "#334155", fontSize: "13px" }}>
                  {sentimentData.metrics.aiExecutiveSummary}
                </span>
              </div>
            </div>
          )}

          {/* Live Passenger Review Feed */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "20px 24px",
              border: "1.5px solid #cbd5e1",
            }}
          >
            <h5 style={{ fontWeight: "800", color: "#1e293b", marginBottom: "16px" }}>
              Live Passenger Reviews &amp; Automated AI Sentiment Classification
            </h5>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {sentimentData?.recentReviews?.map((r, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <strong style={{ color: "#1e293b", fontSize: "14px" }}>{r.passenger}</strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>Seat {r.seat} &bull; {r.route}</span>
                      <div style={{ color: "#ca8a04", fontSize: "12px" }}>
                        {"★".repeat(r.rating)}
                      </div>
                    </div>
                    <p style={{ margin: 0, color: "#334155", fontSize: "13.5px" }}>
                      "{r.comment}"
                    </p>
                  </div>

                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "900",
                      backgroundColor: r.sentiment === "POSITIVE" ? "#dcfce7" : "#fef3c7",
                      color: r.sentiment === "POSITIVE" ? "#15803d" : "#92400e",
                      border: r.sentiment === "POSITIVE" ? "1px solid #86efac" : "1px solid #fde68a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.sentiment === "POSITIVE" ? "😊 POSITIVE" : "😐 NEUTRAL"} ({Math.round(r.score * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: SEQUENCE 11 - SMART DYNAMIC PRICING SUGGESTIONS ================= */}
      {activeTab === "pricing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Interactive Pricing Simulator Controls */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "22px 26px",
              borderRadius: "16px",
              border: "1.5px solid #cbd5e1",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h5 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                  AI Smart Dynamic Pricing Engine &amp; Discount Management
                </h5>
                <small style={{ color: "#64748b" }}>
                  Adjust corridor load factor, base fare and departure urgency to simulate optimal dynamic revenue yield
                </small>
              </div>
              <span
                style={{
                  backgroundColor: "#eff6ff",
                  color: "#1e40af",
                  border: "1px solid #bfdbfe",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "800",
                }}
              >
                ⚡ Sequence 11 Active
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
                  TRANSIT CORRIDOR
                </label>
                <select
                  value={pricingRoute}
                  onChange={(e) => {
                    setPricingRoute(e.target.value);
                    runDynamicPricing(e.target.value, pricingBase, pricingOccupancy, pricingDays);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "13.5px",
                    fontWeight: "700",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <option value="Mumbai ➔ Bengaluru">Mumbai ➔ Bengaluru</option>
                  <option value="Mumbai ➔ Pune">Mumbai ➔ Pune</option>
                  <option value="Delhi ➔ Jaipur">Delhi ➔ Jaipur</option>
                  <option value="Bengaluru ➔ Hyderabad">Bengaluru ➔ Hyderabad</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
                  BASE FARE (₹)
                </label>
                <input
                  type="number"
                  value={pricingBase}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 1000;
                    setPricingBase(val);
                    runDynamicPricing(pricingRoute, val, pricingOccupancy, pricingDays);
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "14px",
                    fontWeight: "700",
                    backgroundColor: "#f8fafc",
                  }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>
                    OCCUPANCY FACTOR
                  </label>
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#2563eb" }}>
                    {pricingOccupancy}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={pricingOccupancy}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPricingOccupancy(val);
                    runDynamicPricing(pricingRoute, pricingBase, val, pricingDays);
                  }}
                  style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "#94a3b8" }}>
                  <span>Low (&lt;50%)</span>
                  <span>Optimal (70-80%)</span>
                  <span>Surge (&gt;85%)</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
                  TIME TO DEPARTURE
                </label>
                <select
                  value={pricingDays}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPricingDays(val);
                    runDynamicPricing(pricingRoute, pricingBase, pricingOccupancy, val);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "13.5px",
                    fontWeight: "700",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <option value={0}>Today (&lt; 12 Hours)</option>
                  <option value={1}>Tomorrow (&lt; 24 Hours)</option>
                  <option value={2}>In 2 Days (48 Hours)</option>
                  <option value={7}>Advance Booking (7+ Days)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Results Grid */}
          {pricingData && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "22px",
                  borderRadius: "16px",
                  border: "1.5px solid #bfdbfe",
                  background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#1e40af", textTransform: "uppercase" }}>
                  AI Recommended Price
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "10px 0" }}>
                  <span style={{ fontSize: "38px", fontWeight: "900", color: "#1e3a8a" }}>
                    ₹ {pricingData.recommendedPrice}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#64748b", textDecoration: "line-through" }}>
                    ₹ {pricingData.basePrice}
                  </span>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "900",
                      backgroundColor: pricingData.adjustmentAmount.startsWith("+") ? "#fee2e2" : "#dcfce7",
                      color: pricingData.adjustmentAmount.startsWith("+") ? "#b91c1c" : "#15803d",
                    }}
                  >
                    {pricingData.adjustmentAmount}
                  </span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#2563eb" }}>
                  Strategy: <strong>{pricingData.pricingStrategy}</strong>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "22px",
                  borderRadius: "16px",
                  border: "1.5px solid #cbd5e1",
                  gridColumn: "span 2",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#475569", textTransform: "uppercase" }}>
                  AI Pricing Rationale &amp; Conversion Forecast
                </span>
                <p style={{ margin: "10px 0", color: "#334155", fontSize: "14px", lineHeight: "1.5", fontWeight: "600" }}>
                  "{pricingData.aiRationale}"
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "14px" }}>
                  <span style={{ backgroundColor: "#f1f5f9", padding: "6px 12px", borderRadius: "10px", fontSize: "12.5px", fontWeight: "700", color: "#334155" }}>
                    📊 Factor: {pricingData.occupancyFactor}
                  </span>
                  <span style={{ backgroundColor: "#ecfdf5", padding: "6px 12px", borderRadius: "10px", fontSize: "12.5px", fontWeight: "700", color: "#065f46" }}>
                    🎯 Target Yield: {pricingData.projectedConversionRate}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Smart Discount Coupons Section */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "22px 26px",
              border: "1.5px solid #cbd5e1",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <h5 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                Active AI Smart Discount Coupons (Corridor &amp; Return Journeys)
              </h5>
              <small style={{ color: "#64748b" }}>Click coupon code to copy to clipboard</small>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
              {pricingData?.smartCoupons?.map((c, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1.5px dashed #3b82f6",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          fontSize: "14px",
                          fontWeight: "900",
                          padding: "3px 10px",
                          borderRadius: "8px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {c.code}
                      </span>
                      <strong style={{ color: "#059669", fontSize: "14px" }}>{c.discount}</strong>
                    </div>
                    <div style={{ fontSize: "12px", color: "#475569", marginTop: "6px", fontWeight: "600" }}>
                      {c.type}
                    </div>
                    <small style={{ color: "#94a3b8", fontSize: "11px" }}>Applies to: {c.appliesTo}</small>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(c.code);
                      setCopiedCoupon(c.code);
                      setTimeout(() => setCopiedCoupon(null), 2500);
                    }}
                    style={{
                      border: "none",
                      backgroundColor: copiedCoupon === c.code ? "#10b981" : "#2563eb",
                      color: "#ffffff",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {copiedCoupon === c.code ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: SEQUENCE 12 - AI REVENUE FORECASTING ================= */}
      {activeTab === "revenue" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Header & Period Switcher */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px 24px",
              borderRadius: "16px",
              border: "1.5px solid #cbd5e1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div>
              <h5 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                AI Revenue Forecasting &amp; Corridor Financial Projections
              </h5>
              <small style={{ color: "#64748b" }}>
                Machine-learning GMV projection, seasonal holiday modeling and corridor profit margins
              </small>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => {
                  setForecastPeriod("30days");
                  fetchRevenueForecast("30days");
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: forecastPeriod === "30days" ? "#2563eb" : "#f1f5f9",
                  color: forecastPeriod === "30days" ? "#ffffff" : "#475569",
                }}
              >
                Next 30 Days Forecast
              </button>
              <button
                onClick={() => {
                  setForecastPeriod("90days");
                  fetchRevenueForecast("90days");
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: forecastPeriod === "90days" ? "#2563eb" : "#f1f5f9",
                  color: forecastPeriod === "90days" ? "#ffffff" : "#475569",
                }}
              >
                90-Day Quarterly Plan
              </button>
            </div>
          </div>

          {/* Revenue KPI Cards */}
          {revenueData && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1.5px solid #cbd5e1",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                <small style={{ color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "11px" }}>
                  CURRENT MONTHLY GMV
                </small>
                <div style={{ fontSize: "30px", fontWeight: "900", color: "#1e293b", margin: "8px 0" }}>
                  {revenueData.currentMonthlyFormatted}
                </div>
                <small style={{ color: "#64748b" }}>Audited across 19 transit corridors</small>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1.5px solid #86efac",
                  background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <small style={{ color: "#15803d", fontWeight: "800", textTransform: "uppercase", fontSize: "11px" }}>
                    PROJECTED NEXT MONTH
                  </small>
                  <span style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: "900", padding: "2px 8px", borderRadius: "8px" }}>
                    {revenueData.projectedGrowthPercentage}
                  </span>
                </div>
                <div style={{ fontSize: "30px", fontWeight: "900", color: "#15803d", margin: "8px 0" }}>
                  {revenueData.projectedNextMonthFormatted}
                </div>
                <small style={{ color: "#166534", fontWeight: "600" }}>+₹7.7 Lakhs increment projected</small>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1.5px solid #cbd5e1",
                }}
              >
                <small style={{ color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "11px" }}>
                  AVERAGE TICKET FARE (AOV)
                </small>
                <div style={{ fontSize: "30px", fontWeight: "900", color: "#1e3a8a", margin: "8px 0" }}>
                  {revenueData.averageOrderValue}
                </div>
                <small style={{ color: "#64748b" }}>Multi-Axle Sleepers &amp; Seaters blended</small>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1.5px solid #cbd5e1",
                }}
              >
                <small style={{ color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "11px" }}>
                  PROJECTED BERTH BOOKINGS
                </small>
                <div style={{ fontSize: "30px", fontWeight: "900", color: "#0f172a", margin: "8px 0" }}>
                  {revenueData.totalProjectedTickets.toLocaleString()}
                </div>
                <small style={{ color: "#64748b" }}>Estimated bookings next 30 days</small>
              </div>
            </div>
          )}

          {/* Seasonal Spike Banner */}
          {revenueData?.seasonalSpikeForecast && (
            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "1.5px solid #fde68a",
                borderRadius: "14px",
                padding: "16px 22px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div style={{ fontSize: "28px" }}>🪔</div>
              <div>
                <strong style={{ color: "#92400e", fontSize: "14px", display: "block" }}>
                  AI Seasonal Spike &amp; Holiday Surge Advisory:
                </strong>
                <span style={{ color: "#78350f", fontSize: "13.5px", fontWeight: "600" }}>
                  {revenueData.seasonalSpikeForecast}
                </span>
              </div>
            </div>
          )}

          {/* Corridor Contribution Breakdown */}
          {revenueData?.corridorContribution && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "22px 26px",
                border: "1.5px solid #cbd5e1",
              }}
            >
              <h5 style={{ fontWeight: "800", color: "#1e293b", marginBottom: "18px" }}>
                Corridor Gross Merchandise Value (GMV) Contribution
              </h5>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                {revenueData.corridorContribution.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "#1e40af", fontSize: "14px" }}>{c.corridor}</strong>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          padding: "2px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        {c.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "10px 0 6px 0" }}>
                      <span style={{ fontSize: "20px", fontWeight: "900", color: "#1e293b" }}>{c.revenue}</span>
                      <span style={{ fontSize: "13px", fontWeight: "800", color: "#059669" }}>{c.share} share</span>
                    </div>

                    <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: c.share,
                          height: "100%",
                          backgroundColor: "#2563eb",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 6: SEQUENCE 13 - AI PERSONALIZED NOTIFICATIONS ================= */}
      {activeTab === "notifications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Persona Switcher Header */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px 24px",
              borderRadius: "16px",
              border: "1.5px solid #cbd5e1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div>
              <h5 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                AI Multi-Channel Notification Personalization Engine
              </h5>
              <small style={{ color: "#64748b" }}>
                Simulate profile-tailored communications: Solo Female Safety focus vs Business Commuter WiFi/Amenity focus
              </small>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b" }}>Simulate Passenger:</span>
              <button
                onClick={() => {
                  setSelectedProfile("pooja");
                  fetchPersonalizedNotification("pooja");
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: selectedProfile === "pooja" ? "#db2777" : "#f1f5f9",
                  color: selectedProfile === "pooja" ? "#ffffff" : "#475569",
                }}
              >
                🌸 Solo Female (Pooja)
              </button>
              <button
                onClick={() => {
                  setSelectedProfile("raju");
                  fetchPersonalizedNotification("raju");
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: selectedProfile === "raju" ? "#2563eb" : "#f1f5f9",
                  color: selectedProfile === "raju" ? "#ffffff" : "#475569",
                }}
              >
                💼 Business Exec (Raju)
              </button>
            </div>
          </div>

          {/* Persona Rationale Badge */}
          {notifData && (
            <div
              style={{
                backgroundColor: selectedProfile === "pooja" ? "#fdf2f8" : "#eff6ff",
                border: selectedProfile === "pooja" ? "1.5px solid #fbcfe8" : "1.5px solid #bfdbfe",
                borderRadius: "14px",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <strong style={{ color: selectedProfile === "pooja" ? "#be185d" : "#1e40af", fontSize: "14px" }}>
                  Active Personalization Tone: {notifData.personalizedTone}
                </strong>
                <div style={{ fontSize: "12.5px", color: "#475569", marginTop: "2px" }}>
                  Target: <strong>{notifData.passengerName}</strong> &bull; Channel rules automatically prioritize peace-of-mind and amenities.
                </div>
              </div>

              <button
                onClick={handleDispatchNotification}
                style={{
                  backgroundColor: selectedProfile === "pooja" ? "#db2777" : "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px 18px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <FaPaperPlane /> Dispatch All Channels
              </button>
            </div>
          )}

          {dispatchedToast && (
            <div
              style={{
                backgroundColor: "#dcfce7",
                border: "1.5px solid #86efac",
                color: "#15803d",
                padding: "12px 20px",
                borderRadius: "12px",
                fontWeight: "800",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaCheckCircle /> Notification payload successfully broadcast to WhatsApp (+91 98200XXXXX), SMS &amp; Email!
            </div>
          )}

          {/* Channel Previews Grid */}
          {notifData?.channels && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
              {/* WhatsApp Card */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1.5px solid #22c55e",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(34, 197, 94, 0.08)",
                }}
              >
                <div style={{ backgroundColor: "#075e54", color: "#ffffff", padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <FaWhatsapp style={{ fontSize: "20px" }} />
                  <div>
                    <strong style={{ fontSize: "14px", display: "block" }}>BlueBus Verified WhatsApp</strong>
                    <small style={{ fontSize: "11px", opacity: 0.85 }}>Official Business Account</small>
                  </div>
                </div>

                <div style={{ backgroundColor: "#ece5dd", padding: "18px", minHeight: "260px" }}>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      padding: "14px 16px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      color: "#111827",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {notifData.channels.whatsapp}
                  </div>
                </div>
              </div>

              {/* SMS Card */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1.5px solid #cbd5e1",
                  overflow: "hidden",
                }}
              >
                <div style={{ backgroundColor: "#1e293b", color: "#ffffff", padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <FaSms style={{ fontSize: "18px" }} />
                  <div>
                    <strong style={{ fontSize: "14px", display: "block" }}>SMS Carrier Gateway</strong>
                    <small style={{ fontSize: "11px", opacity: 0.85 }}>High-Priority DND Route</small>
                  </div>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "18px", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "#ffffff",
                      borderRadius: "16px 16px 4px 16px",
                      padding: "14px 18px",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {notifData.channels.sms}
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1.5px solid #cbd5e1",
                  overflow: "hidden",
                }}
              >
                <div style={{ backgroundColor: "#1e3a8a", color: "#ffffff", padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <FaEnvelope style={{ fontSize: "18px" }} />
                  <div>
                    <strong style={{ fontSize: "14px", display: "block" }}>Branded HTML E-Ticket Slip</strong>
                    <small style={{ fontSize: "11px", opacity: 0.85 }}>Subject: {notifData.channels.email.subject}</small>
                  </div>
                </div>

                <div style={{ padding: "18px", fontSize: "13px", color: "#334155" }}>
                  <div style={{ fontWeight: "800", color: "#1e3a8a", fontSize: "15px", marginBottom: "8px" }}>
                    {notifData.channels.email.headline}
                  </div>

                  <ul style={{ paddingLeft: "18px", margin: "0 0 14px 0", lineHeight: "1.8" }}>
                    {notifData.channels.email.highlights.map((h, i) => (
                      <li key={i} style={{ fontWeight: "600" }}>{h}</li>
                    ))}
                  </ul>

                  <div style={{ padding: "8px 12px", backgroundColor: "#f1f5f9", borderRadius: "8px", fontSize: "12px", color: "#64748b", textAlign: "center" }}>
                    📱 Contactless QR code generated &bull; Valid Govt ID mandatory
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 7: SEQUENCE 14 - AI REVIEW SUMMARIZATION ================= */}
      {activeTab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Header */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px 24px",
              borderRadius: "16px",
              border: "1.5px solid #cbd5e1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div>
              <h5 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                AI Review Summarizer &amp; Passenger Feedback Analytics
              </h5>
              <small style={{ color: "#64748b" }}>
                Distills thousands of verified passenger reviews into executive bullet points, NPS scores and improvement recommendations
              </small>
            </div>

            <button
              onClick={() => fetchReviewSummary()}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "9px 18px",
                fontSize: "13.5px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              Re-Summarize Reviews
            </button>
          </div>

          {/* NPS and Executive Summary Card */}
          {reviewSummaryData && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "22px",
                  borderRadius: "16px",
                  border: "1.5px solid #86efac",
                  background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#166534", textTransform: "uppercase" }}>
                  NET PROMOTER SCORE (NPS)
                </span>
                <div style={{ fontSize: "38px", fontWeight: "900", color: "#15803d", margin: "8px 0" }}>
                  {reviewSummaryData.netPromoterScore.split(" ")[0]}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#166534" }}>
                  {reviewSummaryData.netPromoterScore}
                </div>
                <small style={{ color: "#4b5563", display: "block", marginTop: "4px" }}>
                  Analyzed from {reviewSummaryData.totalReviewsAnalyzed.toLocaleString()} verified passenger ratings
                </small>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "22px",
                  borderRadius: "16px",
                  border: "1.5px solid #cbd5e1",
                  gridColumn: "span 2",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#475569", textTransform: "uppercase" }}>
                  AI Executive Summary
                </span>
                <p style={{ margin: "10px 0", color: "#334155", fontSize: "14px", lineHeight: "1.6", fontWeight: "600" }}>
                  "{reviewSummaryData.executiveSummary}"
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px", marginTop: "14px" }}>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <small style={{ color: "#64748b", display: "block" }}>Cleanliness</small>
                    <strong style={{ color: "#15803d" }}>{reviewSummaryData.aspectScores.cleanliness}</strong>
                  </div>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <small style={{ color: "#64748b", display: "block" }}>Punctuality</small>
                    <strong style={{ color: "#15803d" }}>{reviewSummaryData.aspectScores.punctuality}</strong>
                  </div>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <small style={{ color: "#64748b", display: "block" }}>Driver Safety</small>
                    <strong style={{ color: "#15803d" }}>{reviewSummaryData.aspectScores.driverBehavior}</strong>
                  </div>
                  <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <small style={{ color: "#64748b", display: "block" }}>Seat Comfort</small>
                    <strong style={{ color: "#15803d" }}>{reviewSummaryData.aspectScores.seatComfort}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Strengths and Opportunities Split */}
          {reviewSummaryData && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  border: "1.5px solid #86efac",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "18px", color: "#16a34a" }}>✅</span>
                  <strong style={{ fontSize: "15px", color: "#15803d" }}>Core Passenger Strengths</strong>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {reviewSummaryData.coreStrengths.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: "#f0fdf4",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        color: "#166534",
                        fontWeight: "600",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      &bull; {s}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  border: "1.5px solid #fde68a",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "18px", color: "#ca8a04" }}>💡</span>
                  <strong style={{ fontSize: "15px", color: "#854d0e" }}>Actionable Improvement Opportunities</strong>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {reviewSummaryData.areasForImprovement.map((imp, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: "#fefce8",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        color: "#713f12",
                        fontWeight: "600",
                        border: "1px solid #fef08a",
                      }}
                    >
                      &bull; {imp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 8: SEQUENCE 15 - SECURITY, LOGGING & ANOMALY DETECTION ================= */}
      {activeTab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Hero Threat Level Shield Banner */}
          <div
            style={{
              backgroundColor: "#064e3b",
              borderRadius: "16px",
              padding: "24px 28px",
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              boxShadow: "0 8px 24px rgba(6, 78, 59, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(52, 211, 153, 0.2)",
                  border: "1.5px solid #34d399",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "#34d399",
                }}
              >
                <FaShieldAlt />
              </div>
              <div>
                <span
                  style={{
                    backgroundColor: "#059669",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "900",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Active Telemetry Shield
                </span>
                <h4 style={{ margin: "6px 0 0 0", fontWeight: "900", fontSize: "22px", color: "#ecfdf5" }}>
                  {securityData?.systemThreatLevel || "SECURE (Threat Score: 0/100)"}
                </h4>
                <small style={{ color: "rgba(255,255,255,0.75)" }}>
                  Continuous AI Anomaly Scanning &bull; Zero Double-Booking Collisions &bull; 256-Bit SSL Active
                </small>
              </div>
            </div>

            <button
              onClick={handleAnomalyScan}
              disabled={isScanning}
              style={{
                backgroundColor: "#34d399",
                color: "#064e3b",
                border: "none",
                borderRadius: "10px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "900",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaSyncAlt className={isScanning ? "fa-spin" : ""} />
              {isScanning ? "Scanning Endpoints..." : "Run AI Anomaly Scan"}
            </button>
          </div>

          {/* Scan Result Feedback */}
          {scanResult && (
            <div
              style={{
                backgroundColor: "#ecfdf5",
                border: "1.5px solid #a7f3d0",
                color: "#065f46",
                borderRadius: "14px",
                padding: "14px 20px",
                fontSize: "13px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaCheckCircle style={{ fontSize: "18px", color: "#059669" }} />
              <div>
                <div>AI Scan Completed at {new Date(scanResult.scanCompletedAt).toLocaleTimeString()}: {scanResult.systemHealth} ({scanResult.threatsDetected} Anomalies Found)</div>
                <small style={{ fontWeight: "500", color: "#047857" }}>{scanResult.recommendation}</small>
              </div>
            </div>
          )}

          {/* Security Metrics Grid */}
          {securityData && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
              <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "14px", border: "1.5px solid #cbd5e1" }}>
                <small style={{ color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "11px" }}>FIREWALL RULES</small>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b", margin: "4px 0" }}>
                  {securityData.activeFirewallRules} Active
                </div>
                <small style={{ color: "#16a34a", fontWeight: "700" }}>WAF Filter Engaged</small>
              </div>

              <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "14px", border: "1.5px solid #cbd5e1" }}>
                <small style={{ color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "11px" }}>BLOCKED BOT IPS</small>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "#dc2626", margin: "4px 0" }}>
                  {securityData.blockedMaliciousIPs} Crawlers
                </div>
                <small style={{ color: "#dc2626", fontWeight: "700" }}>Scraping Prevented</small>
              </div>

              <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "14px", border: "1.5px solid #cbd5e1" }}>
                <small style={{ color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "11px" }}>DATABASE LATENCY</small>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "#2563eb", margin: "4px 0" }}>
                  {securityData.databaseQueryLatencyMs}
                </div>
                <small style={{ color: "#2563eb", fontWeight: "700" }}>Nominal Response</small>
              </div>

              <div style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "14px", border: "1.5px solid #cbd5e1" }}>
                <small style={{ color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "11px" }}>IDEMPOTENCY GUARD</small>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "#16a34a", margin: "4px 0" }}>
                  100% Active
                </div>
                <small style={{ color: "#16a34a", fontWeight: "700" }}>Zero Double-Bookings</small>
              </div>
            </div>
          )}

          {/* Live Telemetry Audit Trail Feed */}
          {securityData?.auditLogs && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "20px 24px",
                border: "1.5px solid #cbd5e1",
              }}
            >
              <h5 style={{ fontWeight: "800", color: "#1e293b", marginBottom: "16px" }}>
                Live Security Telemetry &amp; System Audit Events
              </h5>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {securityData.auditLogs.map((log, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "800",
                          backgroundColor: log.severity === "BLOCKED" ? "#fee2e2" : "#dbeafe",
                          color: log.severity === "BLOCKED" ? "#b91c1c" : "#1e40af",
                        }}
                      >
                        {log.type}
                      </span>
                      <span style={{ fontSize: "13px", color: "#1e293b", fontWeight: "600" }}>
                        {log.message}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#64748b" }}>
                      <span>IP: <code>{log.clientIp}</code></span>
                      <span style={{ fontWeight: "700", color: "#94a3b8" }}>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Management;
