import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { error, success } from "../Utils/notification";
import { BiArrowFromLeft } from "react-icons/bi";
import { formatTime } from "../Utils/converObject";
import { getCityBoardingPoints, getCityDroppingPoints } from "../Utils/cityStops";
import {
  FaTicketAlt,
  FaPrint,
  FaDownload,
  FaTrashAlt,
  FaBus,
  FaCheckCircle,
  FaQrcode,
  FaShieldAlt,
  FaCalendarAlt,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaCopy,
  FaRobot,
  FaExchangeAlt,
  FaWallet,
  FaTimesCircle,
  FaInfoCircle,
  FaCloudSun,
  FaSuitcase,
  FaClock,
  FaSnowflake,
  FaBed,
  FaBolt,
  FaWifi,
  FaStar,
} from "react-icons/fa";
import OriginalTicket from "../Components/Ticket/OriginalTicket";

// Monogram colors
const AVATAR_COLORS = [
  "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
  "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  "linear-gradient(135deg, #059669 0%, #047857 100%)",
  "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
  "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
];

function calculateJourney(depTimeStr, arrTimeStr) {
  const parse = (t) => {
    if (!t) return 0;
    const parts = String(t).split(":");
    const h = parseInt(parts[0], 10) || 0;
    const m = parts[1] ? parseInt(parts[1], 10) || 0 : 0;
    return h * 60 + m;
  };
  const depMin = parse(depTimeStr);
  const arrMin = parse(arrTimeStr);
  let diff = arrMin - depMin;
  let isNextDay = false;
  if (diff <= 0) {
    diff += 24 * 60;
    isNextDay = true;
  }
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  return {
    durationStr: `${hours}h ${mins > 0 ? `${mins}m` : "00m"}`,
    durationHours: hours + mins / 60,
    isNextDay,
  };
}

function getOperatorInitials(name) {
  if (!name) return "IS";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function cleanOperatorName(rawName) {
  if (!rawName) return "IntrCity SmartBus";
  let name = rawName.trim();
  name = name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const lower = name.toLowerCase();
  if (
    lower.includes("travel") ||
    lower.includes("tour") ||
    lower.includes("express") ||
    lower.includes("smartbus") ||
    lower.includes("cruiser") ||
    lower.includes("transport") ||
    lower.includes("lines")
  ) {
    return name;
  }
  return `${name} Travels`;
}

function Myticket() {
  const [data, setdata] = useState([]);
  const [today, settoday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicketModal, setSelectedTicketModal] = useState(null);

  // Sequence 6: AI Journey & Travel Assistant State
  const [selectedTravelAssistantModal, setSelectedTravelAssistantModal] = useState(null);
  const [journeyAssistantData, setJourneyAssistantData] = useState(null);
  const [assistantLoading, setAssistantLoading] = useState(false);

  // Sequence 7: AI Cancellation Policy & Smart Refund Assistant State
  const [cancellationModal, setCancellationModal] = useState(null);
  const [cancellationData, setCancellationData] = useState(null);
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccessReceipt, setCancelSuccessReceipt] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTickets();
  }, []);

  async function fetchAllTickets() {
    setIsLoading(true);
    const userid = Cookies.get("userid");

    try {
      const [allRes, todayRes, upcomingRes, pastRes] = await Promise.all([
        axios.post(`${API_BASE_URL}/order/myticket`, { id: userid }).catch(() => ({ data: [] })),
        axios.post(`${API_BASE_URL}/order/myticket/today`, { id: userid }).catch(() => ({ data: [] })),
        axios.post(`${API_BASE_URL}/order/myticket/upcoming`, { id: userid }).catch(() => ({ data: [] })),
        axios.post(`${API_BASE_URL}/order/myticket/past`, { id: userid }).catch(() => ({ data: [] })),
      ]);

      setdata(Array.isArray(allRes.data) ? allRes.data : []);
      settoday(Array.isArray(todayRes.data) ? todayRes.data : []);
      setUpcoming(Array.isArray(upcomingRes.data) ? upcomingRes.data : []);
      setPast(Array.isArray(pastRes.data) ? pastRes.data : []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOpenTravelAssistant(ele) {
    setSelectedTravelAssistantModal(ele);
    setAssistantLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/journey-assistant`, {
        from: ele.busDetails?.from || "Mumbai",
        to: ele.busDetails?.to || "Bengaluru",
        date: ele.ticketSummary?.date,
        departure: ele.busDetails?.departure || "21:00",
        arrival: ele.busDetails?.arrival || "09:30",
      });
      if (res.data) {
        setJourneyAssistantData(res.data);
      }
    } catch (err) {
      console.error("AI Journey Assistant error:", err);
    } finally {
      setAssistantLoading(false);
    }
  }

  async function handleOpenCancellationAssistant(ele) {
    setCancellationModal(ele);
    setCancellationLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/cancellation-policy`, {
        totalFare: ele.ticketSummary?.amount || 1600,
        departureTime: ele.busDetails?.departure || "21:00",
        journeyDate: ele.ticketSummary?.date,
      });
      if (res.data) {
        setCancellationData(res.data);
      }
    } catch (err) {
      console.error("AI Cancellation Policy error:", err);
    } finally {
      setCancellationLoading(false);
    }
  }

  async function handleConfirmCancellation(ele) {
    setIsCancelling(true);
    try {
      await axios.delete(`${API_BASE_URL}/order/oneorder/${ele._id || ele.user}`);
      const refundAmt = cancellationData?.refundAmount || Math.round((ele.ticketSummary?.amount || 1600) * 0.8);
      const refundRef = "RFD_" + Date.now().toString().slice(-8);

      setCancelSuccessReceipt({
        ticketId: ele._id,
        pnr: ele.pnr || `PNR-${ele._id?.toString().slice(-6).toUpperCase()}`,
        refundAmount: refundAmt,
        refundReference: refundRef,
        timeline: cancellationData?.refundTimeline || "Instant UPI / 24-48 Hours",
      });

      setCancellationModal(null);
      success(`Ticket cancelled. Refund of ₹${refundAmt} initiated! Reference: ${refundRef}`);
      fetchAllTickets();
    } catch (err) {
      error("Unable to cancel ticket: " + err.message);
    } finally {
      setIsCancelling(false);
    }
  }

  async function handledelete(ele) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/order/oneorder/${ele._id || ele.user}`);
      success("Ticket Cancelled Successfully");
      fetchAllTickets();
    } catch (err) {
      error("Unable to cancel ticket: " + err.message);
    }
  }

  function handleCopyPnr(pnr) {
    navigator.clipboard.writeText(pnr);
    alert(`PNR ${pnr} copied to clipboard!`);
  }

  // Determine which tickets to display based on active tab
  let displayedTickets = [];
  if (activeTab === "all") displayedTickets = data;
  else if (activeTab === "upcoming") displayedTickets = upcoming;
  else if (activeTab === "today") displayedTickets = today;
  else if (activeTab === "past") displayedTickets = past;

  return (
    <div style={{ maxWidth: "1240px", margin: "auto", padding: "24px 20px" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: "18px",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#1446a0",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              boxShadow: "0 4px 12px rgba(20, 70, 160, 0.25)",
            }}
          >
            <FaTicketAlt />
          </div>
          <div>
            <h3 style={{ margin: 0, fontWeight: "900", color: "#0f172a" }}>My Official Booked Tickets</h3>
            <small style={{ color: "#64748b", fontSize: "13.5px" }}>
              Electronic Reservation Slips (ERS) &bull; Verified Boarding Passes
            </small>
          </div>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/")}
          style={{
            fontWeight: "700",
            fontSize: "14px",
            padding: "10px 20px",
            borderRadius: "10px",
            borderColor: "#1446a0",
            color: "#1446a0",
          }}
        >
          + Book Another Ticket
        </button>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-pills mb-4" style={{ gap: "8px" }}>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
            style={{
              fontWeight: "700",
              borderRadius: "20px",
              padding: "7px 18px",
              fontSize: "13.5px",
              backgroundColor: activeTab === "all" ? "#1446a0" : "#f1f5f9",
              color: activeTab === "all" ? "#fff" : "#475569",
            }}
          >
            All Bookings ({data.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
            style={{
              fontWeight: "700",
              borderRadius: "20px",
              padding: "7px 18px",
              fontSize: "13.5px",
              backgroundColor: activeTab === "upcoming" ? "#1446a0" : "#f1f5f9",
              color: activeTab === "upcoming" ? "#fff" : "#475569",
            }}
          >
            Upcoming ({upcoming.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "today" ? "active" : ""}`}
            onClick={() => setActiveTab("today")}
            style={{
              fontWeight: "700",
              borderRadius: "20px",
              padding: "7px 18px",
              fontSize: "13.5px",
              backgroundColor: activeTab === "today" ? "#1446a0" : "#f1f5f9",
              color: activeTab === "today" ? "#fff" : "#475569",
            }}
          >
            Today ({today.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
            style={{
              fontWeight: "700",
              borderRadius: "20px",
              padding: "7px 18px",
              fontSize: "13.5px",
              backgroundColor: activeTab === "past" ? "#1446a0" : "#f1f5f9",
              color: activeTab === "past" ? "#fff" : "#475569",
            }}
          >
            Past Journeys ({past.length})
          </button>
        </li>
      </ul>

      {/* Loading State */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading your tickets...</span>
          </div>
          <p style={{ marginTop: "15px", color: "#64748b", fontWeight: "600" }}>
            Fetching your confirmed electronic tickets...
          </p>
        </div>
      ) : displayedTickets.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "2px dashed #cbd5e1",
          }}
        >
          <FaBus style={{ fontSize: "52px", color: "#94a3b8", marginBottom: "16px" }} />
          <h4 style={{ color: "#1e293b", fontWeight: "800" }}>No tickets found in this section</h4>
          <p style={{ color: "#64748b", maxWidth: "420px", margin: "auto", marginBottom: "22px" }}>
            You do not have any bookings under this tab. Book your next journey now with instant confirmation.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
            style={{ padding: "10px 26px", fontWeight: "700", borderRadius: "10px", backgroundColor: "#1446a0" }}
          >
            Search &amp; Book Bus Tickets
          </button>
        </div>
      ) : (
        /* Grid of Ultra-Professional Genuine Boarding Pass Ticket Cards */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "24px" }}>
          {displayedTickets.map((ele, idx) => {
            const rawOperator = ele.busDetails?.name || ele.busDetails?.companyname || "Orange Travels Gold Class";
            const operatorName = cleanOperatorName(rawOperator);
            const initials = getOperatorInitials(operatorName);
            const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const pnr = ele.pnr || `PNR-${ele._id?.toString().slice(-6).toUpperCase() || "789ABC"}`;
            const ticketId = `BB-${ele._id?.toString().slice(-8).toUpperCase() || "12345678"}`;
            const dateStr = ele.ticketSummary?.date
              ? new Date(ele.ticketSummary.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Fri, Nov 06, 2026";

            const seatsStr = String(ele.ticketSummary?.ticket || ele.booking?.seats || "1");
            const totalFare = ele.ticketSummary?.amount || ele.booking?.totalAmount || 1600;

            const passengers = Array.isArray(ele.passengers) && ele.passengers.length > 0
              ? ele.passengers
              : [
                  {
                    seat: seatsStr,
                    name: ele.userDetails?.name || "Raju Rastogi",
                    age: ele.userDetails?.age || 26,
                    gender: ele.userDetails?.gender || "male",
                  },
                ];

            const depRaw = ele.busDetails?.departure || "23:30";
            const arrRaw = ele.busDetails?.arrival || "06:00";
            const depTime = formatTime(depRaw);
            const arrTime = formatTime(arrRaw);
            const journey = calculateJourney(depRaw, arrRaw);
            const fromCity = ele.busDetails?.from || "Pune";
            const toCity = ele.busDetails?.to || "Jalgaon";
            const boardingHub =
              ele.busDetails?.boardingPoint?.split(" (")[0] ||
              getCityBoardingPoints(fromCity, depRaw)[0]?.name ||
              `${fromCity} Center`;
            const droppingHub =
              ele.busDetails?.droppingPoint?.split(" (")[0] ||
              getCityDroppingPoints(toCity, arrRaw)[0]?.name ||
              `${toCity} Bypass`;

            return (
              <div
                key={ele._id || idx}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "18px",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                  border: "1.5px solid #cbd5e1",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 14px 32px rgba(20, 70, 160, 0.16)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.08)";
                }}
              >
                {/* 1. Header with Operator Info, Badges and Rating */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "10px",
                    padding: "18px 20px 12px 20px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: avatarBg,
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "900",
                        fontSize: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <h5 style={{ margin: 0, fontWeight: "900", fontSize: "17.5px", color: "#0f172a" }}>
                          {operatorName}
                        </h5>
                        <span
                          style={{
                            backgroundColor: "#ecfdf5",
                            color: "#065f46",
                            border: "1px solid #a7f3d0",
                            fontSize: "11px",
                            fontWeight: "800",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaShieldAlt style={{ fontSize: "10px" }} /> Safety+ Certified
                        </span>
                      </div>
                      <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "600", marginTop: "2px" }}>
                        Volvo AC Multi-Axle Sleeper (2+1) &bull; <span style={{ color: "#059669", fontWeight: "700" }}>Live GPS Tracking</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        backgroundColor: "#15803d",
                        color: "#ffffff",
                        padding: "3px 10px",
                        borderRadius: "8px",
                        fontSize: "12.5px",
                        fontWeight: "800",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FaStar style={{ fontSize: "11px" }} /> 4.8 / 5
                    </div>
                    <span
                      style={{
                        backgroundColor: "#ecfdf5",
                        color: "#065f46",
                        border: "1px solid #a7f3d0",
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FaCheckCircle style={{ color: "#10b981", fontSize: "10px" }} /> CONFIRMED
                    </span>
                  </div>
                </div>

                {/* 2. Journey Timeline Bar (RedBus / IntrCity Classic Style) */}
                <div
                  style={{
                    margin: "12px 18px 10px 18px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    border: "1.5px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a" }}>
                      {depTime}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "#1446a0", marginTop: "2px" }}>
                      {fromCity}
                    </div>
                    <small style={{ color: "#64748b", fontSize: "11px", display: "block", marginTop: "2px", fontWeight: "600" }}>
                      Hub: {boardingHub}
                    </small>
                  </div>

                  <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minWidth: "120px" }}>
                    <span
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        padding: "3px 10px",
                        borderRadius: "14px",
                        fontSize: "11px",
                        fontWeight: "800",
                        color: "#334155",
                        marginBottom: "4px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FaClock style={{ fontSize: "10px", color: "#64748b" }} />
                      {journey.durationStr}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
                      <div style={{ height: "2px", backgroundColor: "#cbd5e1", flex: 1 }}></div>
                      <span style={{ fontSize: "14px", margin: "0 6px" }}>🚌</span>
                      <div style={{ height: "2px", backgroundColor: "#cbd5e1", flex: 1 }}></div>
                    </div>
                    <small style={{ color: "#64748b", fontSize: "10px", fontWeight: "800", marginTop: "2px", textTransform: "uppercase" }}>
                      {journey.isNextDay ? "Overnight Express" : "Direct Route"}
                    </small>
                  </div>

                  <div style={{ flex: 1, textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px" }}>
                      <span style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a" }}>
                        {arrTime}
                      </span>
                      {journey.isNextDay && (
                        <span
                          style={{
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            border: "1px solid #bfdbfe",
                            fontSize: "9.5px",
                            fontWeight: "900",
                            padding: "2px 6px",
                            borderRadius: "6px",
                          }}
                        >
                          +1 Next Day
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "#1446a0", marginTop: "2px" }}>
                      {toCity}
                    </div>
                    <small style={{ color: "#64748b", fontSize: "11px", display: "block", marginTop: "2px", fontWeight: "600" }}>
                      Drop: {droppingHub}
                    </small>
                  </div>
                </div>

                {/* 3. Amenities Pills Strip (Matching Screenshot) */}
                <div style={{ margin: "0 18px 10px 18px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", fontSize: "10.5px", fontWeight: "700", padding: "3px 8px", borderRadius: "14px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <FaSnowflake style={{ fontSize: "9px" }} /> A/C Cooled
                  </span>
                  <span style={{ backgroundColor: "#f8fafc", color: "#334155", border: "1px solid #e2e8f0", fontSize: "10.5px", fontWeight: "700", padding: "3px 8px", borderRadius: "14px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <FaBed style={{ fontSize: "10px", color: "#64748b" }} /> Sleeper Berths (2+1)
                  </span>
                  <span style={{ backgroundColor: "#fefce8", color: "#854d0e", border: "1px solid #fef08a", fontSize: "10.5px", fontWeight: "700", padding: "3px 8px", borderRadius: "14px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <FaBolt style={{ fontSize: "9px", color: "#ca8a04" }} /> USB Charging
                  </span>
                  <span style={{ backgroundColor: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", fontSize: "10.5px", fontWeight: "700", padding: "3px 8px", borderRadius: "14px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <FaWifi style={{ fontSize: "9px", color: "#0284c7" }} /> Free WiFi
                  </span>
                  <span style={{ backgroundColor: "#fdf2f8", color: "#be185d", border: "1px solid #fbcfe8", fontSize: "10.5px", fontWeight: "700", padding: "3px 8px", borderRadius: "14px" }}>
                    🌸 Reserved Ladies Berths
                  </span>
                </div>

                {/* 4. PNR, Passengers & Total Fare Bar */}
                <div
                  style={{
                    margin: "0 18px 12px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f8fafc",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1px dashed #cbd5e1",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <small style={{ color: "#64748b", fontSize: "10.5px", fontWeight: "800", textTransform: "uppercase" }}>PNR:</small>
                    <strong style={{ fontSize: "14px", color: "#1446a0", letterSpacing: "0.5px" }}>{pnr}</strong>
                    <button
                      onClick={() => handleCopyPnr(pnr)}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "5px",
                        padding: "2px 7px",
                        fontSize: "10.5px",
                        fontWeight: "700",
                        color: "#475569",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <FaCopy /> Copy
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      {passengers.length > 1 ? (
                        <>
                          Travellers ({passengers.length}):{" "}
                          <strong style={{ color: "#1e293b" }}>{passengers[0]?.name}</strong>{" "}
                          <span style={{ color: "#2563eb", fontWeight: "700" }}>
                            +{passengers.length - 1} more
                          </span>
                        </>
                      ) : (
                        <>
                          Passenger:{" "}
                          <strong style={{ color: "#1e293b" }}>
                            {passengers[0]?.name || "Passenger"}
                          </strong>{" "}
                          ({passengers[0]?.age || 24} yrs,{" "}
                          {(passengers[0]?.gender || "").toLowerCase() === "female"
                            ? "🌸 Female"
                            : "🔵 Male"}
                          )
                        </>
                      )}
                    </span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      Date: <strong>{dateStr}</strong>
                    </span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        backgroundColor: "#dbeafe",
                        color: "#1e40af",
                        fontWeight: "800",
                        padding: "2px 7px",
                        borderRadius: "6px",
                      }}
                    >
                      {seatsStr.includes(",")
                        ? `Seats (${seatsStr.split(",").length}): ${seatsStr}`
                        : `Seat ${seatsStr}`}
                    </span>
                    <span style={{ fontSize: "15px", fontWeight: "900", color: "#15803d" }}>
                      ₹ {totalFare}
                    </span>
                  </div>
                </div>

                {/* Perforated Stub Line with Circles */}
                <div style={{ position: "relative", height: "16px", margin: "0 -8px" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "-8px",
                      top: "0",
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "50%",
                      borderRight: "1.5px solid #cbd5e1",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "-8px",
                      top: "0",
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "50%",
                      borderLeft: "1.5px solid #cbd5e1",
                    }}
                  />
                  <div
                    style={{
                      borderTop: "2px dashed #cbd5e1",
                      marginTop: "7px",
                      width: "100%",
                    }}
                  />
                </div>

                {/* Actions Bar Footer */}
                <div
                  style={{
                    padding: "14px 20px",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => setSelectedTicketModal(ele)}
                    style={{
                      flex: "1 1 130px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "12.5px",
                      fontWeight: "800",
                      backgroundColor: "#1446a0",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(20, 70, 160, 0.2)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0d2f6c")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1446a0")}
                  >
                    <FaDownload /> Download Ticket (PDF)
                  </button>

                  <button
                    onClick={() => handleOpenTravelAssistant(ele)}
                    style={{
                      flex: "1 1 140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "12.5px",
                      fontWeight: "800",
                      backgroundColor: "#4f46e5",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(79, 70, 229, 0.25)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3730a3")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
                  >
                    <FaRobot /> AI Travel Assistant
                  </button>

                  <button
                    onClick={() => handleOpenCancellationAssistant(ele)}
                    style={{
                      flex: "0 1 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      fontSize: "12px",
                      fontWeight: "700",
                      backgroundColor: "#ffffff",
                      color: "#dc2626",
                      border: "1.5px solid #fca5a5",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                  >
                    <FaTrashAlt /> Cancel &amp; Refund
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Original E-Ticket Full-Screen Modal (Sequence 6) */}
      {selectedTicketModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 10px",
            overflowY: "auto",
          }}
          onClick={() => setSelectedTicketModal(null)}
        >
          <div
            style={{
              maxWidth: "880px",
              width: "100%",
              maxHeight: "94vh",
              overflowY: "auto",
              borderRadius: "18px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <OriginalTicket
              ticketData={selectedTicketModal}
              onClose={() => setSelectedTicketModal(null)}
              showCloseButton={true}
            />
          </div>
        </div>
      )}

      {/* Sequence 6: AI Journey & Travel Assistant Modal */}
      {selectedTravelAssistantModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 10px",
          }}
          onClick={() => setSelectedTravelAssistantModal(null)}
        >
          <div
            style={{
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "26px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              border: "2px solid #818cf8",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "14px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#4f46e5", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <FaRobot />
                </div>
                <div>
                  <h5 style={{ margin: 0, fontWeight: "900", color: "#1e1b4b" }}>
                    AI Travel &amp; Journey Assistant
                  </h5>
                  <small style={{ color: "#4f46e5", fontWeight: "700" }}>
                    Sequence 6 Active &bull; {selectedTravelAssistantModal.busDetails?.from} ➔ {selectedTravelAssistantModal.busDetails?.to}
                  </small>
                </div>
              </div>
              <button
                onClick={() => setSelectedTravelAssistantModal(null)}
                style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#64748b" }}
              >
                &times;
              </button>
            </div>

            {assistantLoading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div className="spinner-border text-primary" role="status"></div>
                <p style={{ marginTop: "12px", color: "#64748b" }}>AI is analyzing route conditions &amp; weather...</p>
              </div>
            ) : journeyAssistantData ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* On-Time Likelihood Strip */}
                <div style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)", padding: "14px 18px", borderRadius: "12px", border: "1.5px solid #c7d2fe", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ color: "#3730a3", fontSize: "14px", display: "block" }}>On-Time Arrival Likelihood</strong>
                    <span style={{ fontSize: "12px", color: "#475569" }}>{journeyAssistantData.routeHighway}</span>
                  </div>
                  <span style={{ backgroundColor: "#4f46e5", color: "#ffffff", fontSize: "16px", fontWeight: "900", padding: "6px 14px", borderRadius: "14px" }}>
                    {journeyAssistantData.onTimeLikelihood}
                  </span>
                </div>

                {/* Weather Forecast Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12.5px" }}>
                  <div style={{ backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <strong style={{ color: "#1e40af", display: "block", marginBottom: "4px" }}>Departure Weather</strong>
                    <span style={{ color: "#334155" }}>{journeyAssistantData.departureWeather}</span>
                  </div>
                  <div style={{ backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <strong style={{ color: "#059669", display: "block", marginBottom: "4px" }}>Arrival Weather</strong>
                    <span style={{ color: "#334155" }}>{journeyAssistantData.arrivalWeather}</span>
                  </div>
                </div>

                {/* Packing Checklist */}
                <div style={{ backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <strong style={{ color: "#1e293b", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                    🎒 Essential Passenger Checklist for this Route:
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", color: "#334155" }}>
                    {journeyAssistantData.packingChecklist?.map((item, i) => (
                      <li key={i} style={{ marginBottom: "4px" }}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Quick Journey FAQs */}
                <div style={{ backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <strong style={{ color: "#1e293b", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                    ❓ Common Journey Inquiries:
                  </strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                    {journeyAssistantData.quickFaq?.map((faq, i) => (
                      <div key={i}>
                        <strong style={{ color: "#1e40af" }}>Q: {faq.q}</strong>
                        <div style={{ color: "#475569" }}>A: {faq.a}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Print Button */}
                <button
                  onClick={() => {
                    setSelectedTicketModal(selectedTravelAssistantModal);
                    setSelectedTravelAssistantModal(null);
                  }}
                  style={{
                    backgroundColor: "#1446a0",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px",
                    fontWeight: "800",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <FaDownload /> Download Official E-Ticket PDF
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Sequence 7: AI Cancellation Policy & Smart Refund Assistant Modal */}
      {cancellationModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 10px",
          }}
          onClick={() => setCancellationModal(null)}
        >
          <div
            style={{
              maxWidth: "640px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "26px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              border: "2px solid #f87171",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "14px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#dc2626", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <FaTrashAlt />
                </div>
                <div>
                  <h5 style={{ margin: 0, fontWeight: "900", color: "#991b1b" }}>
                    AI Cancellation Policy &amp; Refund Assistant
                  </h5>
                  <small style={{ color: "#dc2626", fontWeight: "700" }}>
                    Sequence 7 Active &bull; PNR: {cancellationModal.pnr || cancellationModal._id?.toString().slice(-6).toUpperCase()}
                  </small>
                </div>
              </div>
              <button
                onClick={() => setCancellationModal(null)}
                style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#64748b" }}
              >
                &times;
              </button>
            </div>

            {cancellationLoading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div className="spinner-border text-danger" role="status"></div>
                <p style={{ marginTop: "12px", color: "#64748b" }}>Calculating exact policy refund &amp; deduction breakdown...</p>
              </div>
            ) : cancellationData ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Live Refund Breakdown Box */}
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    border: "1.5px solid #fecaca",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#7f1d1d", fontWeight: "700" }}>
                      ⏰ Time Until Departure: <strong>{cancellationData.hoursRemaining} Hours</strong>
                    </span>
                    <span style={{ backgroundColor: "#dc2626", color: "#ffffff", fontSize: "11px", fontWeight: "900", padding: "2px 8px", borderRadius: "10px" }}>
                      {cancellationData.refundPercentage}% Refund Eligible
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px dashed #fca5a5", paddingTop: "10px" }}>
                    <div>
                      <small style={{ color: "#64748b", display: "block" }}>Original Fare Paid: ₹{cancellationData.totalFare}</small>
                      <small style={{ color: "#dc2626", display: "block" }}>Deduction Fee ({cancellationData.deductionPercentage}%): -₹{cancellationData.deductionAmount}</small>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <small style={{ color: "#15803d", fontWeight: "700" }}>NET REFUND AMOUNT</small>
                      <div style={{ fontSize: "26px", fontWeight: "900", color: "#15803d" }}>
                        ₹ {cancellationData.refundAmount}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#475569" }}>
                    <em>{cancellationData.tierDescription}</em>
                  </div>
                </div>

                {/* AI Smart Alternatives Box */}
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1.5px solid #86efac",
                    borderRadius: "14px",
                    padding: "16px",
                  }}
                >
                  <strong style={{ color: "#166534", fontSize: "13.5px", display: "block", marginBottom: "8px" }}>
                    💡 AI Smart Alternatives (Avoid Paying Deductions):
                  </strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px" }}>
                    {cancellationData.smartAlternatives?.map((alt, i) => (
                      <div key={i} style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ color: "#15803d" }}>{alt.title}</strong>
                          <span style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: "800", padding: "2px 6px", borderRadius: "6px" }}>
                            {alt.benefit}
                          </span>
                        </div>
                        <div style={{ color: "#475569", marginTop: "3px" }}>{alt.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setCancellationModal(null)}
                    style={{
                      flex: 1,
                      backgroundColor: "#f1f5f9",
                      color: "#334155",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "12px",
                      fontWeight: "700",
                      fontSize: "13.5px",
                      cursor: "pointer",
                    }}
                  >
                    Keep My Ticket (Do Not Cancel)
                  </button>

                  <button
                    onClick={() => handleConfirmCancellation(cancellationModal)}
                    disabled={isCancelling}
                    style={{
                      flex: 1.2,
                      backgroundColor: "#dc2626",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px",
                      fontWeight: "800",
                      fontSize: "13.5px",
                      cursor: "pointer",
                      boxShadow: "0 3px 10px rgba(220, 38, 38, 0.3)",
                    }}
                  >
                    {isCancelling ? "Processing Refund..." : `Confirm & Refund ₹${cancellationData.refundAmount}`}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Refund Success Confirmation Receipt Modal */}
      {cancelSuccessReceipt && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 10px",
          }}
          onClick={() => setCancelSuccessReceipt(null)}
        >
          <div
            style={{
              maxWidth: "520px",
              width: "100%",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "28px",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              border: "2px solid #86efac",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ color: "#15803d", fontSize: "48px", marginBottom: "10px" }}>
              <FaCheckCircle />
            </div>
            <h4 style={{ fontWeight: "900", color: "#1446a0", marginBottom: "6px" }}>
              Cancellation &amp; Refund Confirmed!
            </h4>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
              Your booking has been cancelled and your seat released back to the fleet.
            </p>

            <div style={{ backgroundColor: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "12px", padding: "16px", marginBottom: "20px", textAlign: "left", fontSize: "13.5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748b" }}>Refund Reference:</span>
                <strong style={{ color: "#15803d" }}>{cancelSuccessReceipt.refundReference}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748b" }}>PNR Number:</span>
                <strong>{cancelSuccessReceipt.pnr}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748b" }}>Refund Amount:</span>
                <strong style={{ color: "#15803d", fontSize: "16px" }}>₹ {cancelSuccessReceipt.refundAmount}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Estimated Timeline:</span>
                <span>{cancelSuccessReceipt.timeline}</span>
              </div>
            </div>

            <button
              onClick={() => setCancelSuccessReceipt(null)}
              style={{
                width: "100%",
                backgroundColor: "#1446a0",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "800",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Myticket;
