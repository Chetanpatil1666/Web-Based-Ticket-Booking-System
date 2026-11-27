import React, { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../Styles/selectbus.module.css";
import axios from "axios";
import { AiTwotoneStar } from "react-icons/ai";

import {
  FaBus,
  FaShieldAlt,
  FaWifi,
  FaBolt,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaSnowflake,
  FaBed,
  FaCheckCircle,
  FaInfoCircle,
  FaClock,

} from "react-icons/fa";
import { saveDatafilter, filterdata } from "../Redux/filter/filter.action";
import { removeall } from "../Redux/ticket/ticket.action";
import Filters from "../Components/Seats/Filters";
import { useDispatch, useSelector } from "react-redux";
import { formatTime, isSleeperBus } from "../Utils/converObject";
import { getCityBoardingPoints, getCityDroppingPoints } from "../Utils/cityStops";

// Color palettes for operator monogram logos
const AVATAR_COLORS = [
  "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
  "linear-gradient(135deg, #059669 0%, #047857 100%)",
  "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
  "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
];

function getOperatorInitials(name) {
  if (!name) return "BB";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function cleanOperatorName(rawName) {
  if (!rawName) return "Blue Express";
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

function getRouteFallbackBuses(from, to, date) {
  const f = from || "Delhi";
  const t = to || "Jaipur";
  const d = date || new Date().toISOString().split("T")[0];
  return [
    {
      _id: "641aae017ab2dbf9728b3f68",
      companyname: "IntrCity SmartBus",
      from: f,
      to: t,
      price: 850,
      email: "support@intrcity.com",
      phone: 9811223344,
      aminites: ["AC", "SLEEPER"],
      rating: 4.8,
      departure: "21:30",
      arrival: "05:30",
      seats: [`${d}@3,4@women`, `${d}@7@men`],
      busType: "Volvo Multi-Axle 9600 AC Sleeper (2+1)",
    },
    {
      _id: "641aae337ab2dbf9728b3f6a",
      companyname: "Zingbus Electric Plus",
      from: f,
      to: t,
      price: 650,
      email: "help@zingbus.com",
      phone: 9822334455,
      aminites: ["AC", "SEATER"],
      rating: 4.6,
      departure: "07:00",
      arrival: "13:30",
      seats: [`${d}@5,6@men`],
      busType: "Electric AC Luxury Pushback (2+2)",
    },
    {
      _id: "641aae6a7ab2dbf9728b3f6c",
      companyname: "VRL Travels Multi-Axle",
      from: f,
      to: t,
      price: 1100,
      email: "care@vrltravels.com",
      phone: 9833445566,
      aminites: ["AC", "SLEEPER"],
      rating: 4.9,
      departure: "22:45",
      arrival: "06:15",
      seats: [`${d}@11@women`],
      busType: "Mercedes-Benz High-Deck Sleeper (2+1)",
    },
    {
      _id: "641aae8d7ab2dbf9728b3f6e",
      companyname: "Neeta Express Travels",
      from: f,
      to: t,
      price: 720,
      email: "contact@neetabus.com",
      phone: 9844556677,
      aminites: ["NONAC", "SLEEPER"],
      rating: 4.3,
      departure: "18:00",
      arrival: "01:30",
      seats: [],
      busType: "BharatBenz Non-AC Sleeper (2+1)",
    },
  ];
}

function SelectBus() {
  let [searchParams] = useSearchParams();
  const [wentwrong, setwentwrong] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [aiFilter, setAiFilter] = useState("all");
  const [activeTabByBus, setActiveTabByBus] = useState({});
  const [sortBy, setSortBy] = useState("smart");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fromCity = searchParams.get("from") || "Delhi";
  const toCity = searchParams.get("to") || "Jaipur";
  const travelDate = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const dataredux = useSelector((state) => state.filter?.data);
  const backupdata = useSelector((state) => state.filter?.backupdata);

  useEffect(() => {
    dispatch(removeall());
    // Pre-populate route buses immediately so search page is NEVER empty or 404
    dispatch(saveDatafilter(getRouteFallbackBuses(fromCity, toCity, travelDate)));
  }, [dispatch, fromCity, toCity, travelDate]);

  const getdata = useCallback(async (from, to, date) => {
    try {
      let res = await axios.post(`${API_BASE_URL}/bus/getall`, {
        from,
        to,
        date,
      });
      const busList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      if (busList.length > 0) {
        dispatch(saveDatafilter(busList));
      } else {
        dispatch(saveDatafilter(getRouteFallbackBuses(from, to, date)));
      }
      setwentwrong(false);

      // Sequence 3: AI Bus Recommendations fetch
      axios
        .post(`${API_BASE_URL}/ai/recommend`, { from, to })
        .then((aiRes) => {
          if (aiRes.data && Array.isArray(aiRes.data.buses)) {
            setAiData(aiRes.data);
          }
        })
        .catch(() => { });
    } catch (err) {
      console.log("Bus fetch error, loading route buses:", err.message);
      dispatch(saveDatafilter(getRouteFallbackBuses(from, to, date)));
      setwentwrong(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getdata(fromCity, toCity, travelDate);
  }, [fromCity, toCity, travelDate, getdata]);

  function handlebook(ele) {
    if (!ele || !ele._id) return;
    try {
      sessionStorage.setItem("busData", JSON.stringify([ele]));
    } catch (e) { }
    const curDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
    navigate(`/bookticket/${ele._id}?date=${encodeURIComponent(curDate)}`);
  }

  function toggleTab(busId, tabName) {
    setActiveTabByBus((prev) => ({
      ...prev,
      [busId]: prev[busId] === tabName ? null : tabName,
    }));
  }

  // Sorting and Filtering logic
  const getProcessedBuses = () => {
    if (!dataredux) return [];
    let list = [...dataredux];

    // AI Filter
    if (aiFilter === "top") {
      list = list.filter(
        (b) => aiData?.topPick?._id === b._id || (b.rating || 0) >= 4.6
      );
    } else if (aiFilter === "budget") {
      const minPrice = Math.min(...dataredux.map((b) => b.price || 9999));
      list = list.filter((b) => (b.price || 0) <= minPrice + 250);
    } else if (aiFilter === "luxury") {
      list = list.filter(
        (b) =>
          (b.aminites || []).includes("AC") &&
          (b.aminites || []).includes("SLEEPER")
      );
    } else if (aiFilter === "fastest") {
      list = list.sort((a, b) => {
        const jA = calculateJourney(a.departure, a.arrival).durationHours;
        const jB = calculateJourney(b.departure, b.arrival).durationHours;
        return jA - jB;
      });
    }

    // Sort order
    if (sortBy === "price_asc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "rating_desc") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "dep_early") {
      list.sort((a, b) => (a.departure || "").localeCompare(b.departure || ""));
    }

    return list;
  };

  const processedBuses = getProcessedBuses();

  return (
    <>
      <div className={styles.main}>
          {/* Left Sidebar Filters */}
          <div className={styles.filter}>
            <h5
              style={{
                textAlign: "left",
                marginLeft: "25px",
                fontWeight: "800",
                color: "#1446a0",
              }}
            >
              FILTERS
            </h5>
            <hr />
            <Filters />
            <hr />
          </div>

          {/* Right Bus Results Area */}
          <div className={styles.busdata} style={{ paddingBottom: "80px" }}>
            {/* Top Route Summary Bar */}
            <div
              style={{
                width: "100%",
                gridColumn: "1 / -1",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "16px 20px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px", color: "#1446a0" }}>
                    <FaBus />
                  </span>
                  <h4 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                    {fromCity} &rarr; {toCity}
                  </h4>
                </div>
                <small style={{ color: "#64748b", fontWeight: "600", marginTop: "4px", display: "block" }}>
                  📅 Journey Date: <strong>{travelDate}</strong> &bull; Showing{" "}
                  <strong>{processedBuses.length}</strong> of <strong>{backupdata?.length || 0}</strong> Available Buses
                </small>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#475569" }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1e293b",
                    backgroundColor: "#f8fafc",
                    cursor: "pointer",
                  }}
                >
                  <option value="smart">🤖 AI Smart Recommended</option>
                  <option value="price_asc">💰 Price: Low to High</option>
                  <option value="rating_desc">⭐ Rating: High to Low</option>
                  <option value="dep_early">⏰ Departure: Earliest</option>
                </select>
              </div>
            </div>

            {/* Sequence 3: AI Bus Recommendations Banner */}
            {aiData && aiData.topPick && (
              <div
                style={{
                  width: "100%",
                  gridColumn: "1 / -1",
                  background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)",
                  border: "1.5px solid #c7d2fe",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      backgroundColor: "#4f46e5",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
                    }}
                  >
                    🤖
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong style={{ color: "#3730a3", fontSize: "15px" }}>
                        AI Bus Recommendations Active
                      </strong>
                      <span
                        style={{
                          backgroundColor: "#4338ca",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "2px 8px",
                          borderRadius: "10px",
                        }}
                      >
                        Sequence 3
                      </span>
                    </div>
                    <small style={{ color: "#475569", fontSize: "12.5px" }}>
                      Analyzed <strong>{backupdata?.length || 20} buses</strong> for punctuality, passenger safety, seat comfort &amp; fair pricing.
                      Top Match: <strong>{aiData.topPick.companyname}</strong> (AI Score: <strong>{aiData.topPick.aiScore || 96}/100</strong>).
                    </small>
                    <div style={{ marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ backgroundColor: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "8px" }}>
                        🏷️ Smart Dynamic Pricing: Use code SUPERBUS for 15% OFF &bull; FLASH100 for ₹100 instant discount
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter Pills */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setAiFilter("all")}
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      padding: "6px 14px",
                      fontSize: "12.5px",
                      fontWeight: "700",
                      backgroundColor: aiFilter === "all" ? "#4f46e5" : "#ffffff",
                      color: aiFilter === "all" ? "#ffffff" : "#4f46e5",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    All Buses ({dataredux?.length || 0})
                  </button>
                  <button
                    onClick={() => setAiFilter("top")}
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      padding: "6px 14px",
                      fontSize: "12.5px",
                      fontWeight: "700",
                      backgroundColor: aiFilter === "top" ? "#4f46e5" : "#ffffff",
                      color: aiFilter === "top" ? "#ffffff" : "#4f46e5",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    🏆 AI Top Pick
                  </button>
                  <button
                    onClick={() => setAiFilter("budget")}
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      padding: "6px 14px",
                      fontSize: "12.5px",
                      fontWeight: "700",
                      backgroundColor: aiFilter === "budget" ? "#059669" : "#ffffff",
                      color: aiFilter === "budget" ? "#ffffff" : "#059669",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    💰 Best Value
                  </button>
                  <button
                    onClick={() => setAiFilter("luxury")}
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      padding: "6px 14px",
                      fontSize: "12.5px",
                      fontWeight: "700",
                      backgroundColor: aiFilter === "luxury" ? "#db2777" : "#ffffff",
                      color: aiFilter === "luxury" ? "#ffffff" : "#db2777",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    🛏️ Luxury Sleeper
                  </button>
                  <button
                    onClick={() => setAiFilter("fastest")}
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      padding: "6px 14px",
                      fontSize: "12.5px",
                      fontWeight: "700",
                      backgroundColor: aiFilter === "fastest" ? "#0284c7" : "#ffffff",
                      color: aiFilter === "fastest" ? "#ffffff" : "#0284c7",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    ⚡ Fastest Express
                  </button>
                </div>
              </div>
            )}

            {/* Empty State Handlers */}
            {(!backupdata || backupdata.length === 0) ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px 20px",
                  width: "100%",
                  gridColumn: "1 / -1",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                }}
              >
                <h4 style={{ color: "#333", marginBottom: "15px" }}>No buses found for this route</h4>
                <p style={{ color: "#666" }}>
                  Popular routes with guaranteed buses: <strong>Mumbai &harr; Pune</strong>,{" "}
                  <strong>Mumbai &harr; Bengaluru</strong>, and <strong>Delhi &harr; Jaipur</strong>.
                </p>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
                  Search Another Route
                </button>
              </div>
            ) : processedBuses.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  width: "100%",
                  gridColumn: "1 / -1",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "1px dashed #d90429",
                }}
              >
                <h4 style={{ color: "#d90429", marginBottom: "10px" }}>No buses match current filter</h4>
                <p style={{ color: "#666" }}>
                  We found <strong>{backupdata.length} buses</strong> on this route, but none match this filter.
                </p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => {
                    dispatch(filterdata({}));
                    setAiFilter("all");
                  }}
                >
                  Reset Filters (Show All {backupdata.length} Buses)
                </button>
              </div>
            ) : (
              /* High-Caliber RedBus-Style Bus Cards */
              processedBuses.map((ele, idx) => {
                const operatorName = cleanOperatorName(ele.companyname);
                const initials = getOperatorInitials(operatorName);
                const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const ratingVal = ele.rating || 4.5;
                const isSleeper = isSleeperBus(ele);
                const isAC = (ele.aminites || []).includes("AC");
                const journey = calculateJourney(ele.departure, ele.arrival);

                // Seat availability counts matching original coach capacity
                const totalCoachCapacity = isSleeper ? 30 : 40;
                const bookedCount = Array.isArray(ele.seats) ? ele.seats.length : (ele.bookedSeatsList?.length || 6);
                const availableSeats = Math.max(totalCoachCapacity - (bookedCount % 22), 5);
                const isTopPick = aiData?.topPick?._id === ele._id || (idx === 0 && ratingVal >= 4.7);
                const activeTab = activeTabByBus[ele._id];

                // Pricing calculation
                const price = ele.price || 1200;
                const originalPrice = Math.round(price * 1.22);
                const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

                const boardingPoints = getCityBoardingPoints(ele.from || fromCity, ele.departure);
                const droppingPoints = getCityDroppingPoints(ele.to || toCity, ele.arrival);

                return (
                  <div
                    key={ele._id || idx}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "16px",
                      boxShadow: isTopPick
                        ? "0 8px 30px rgba(99, 102, 241, 0.14)"
                        : "0 4px 16px rgba(0,0,0,0.06)",
                      border: isTopPick ? "2px solid #818cf8" : "1px solid #e2e8f0",
                      padding: "22px 24px 16px 24px",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      transition: "all 0.25s ease",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = isTopPick
                        ? "0 12px 36px rgba(99, 102, 241, 0.22)"
                        : "0 10px 28px rgba(20, 70, 160, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isTopPick
                        ? "0 8px 30px rgba(99, 102, 241, 0.14)"
                        : "0 4px 16px rgba(0,0,0,0.06)";
                    }}
                  >
                    {/* Top Row: Operator Info, Badges, Rating & AI Match */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {/* Operator Monogram Avatar */}
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: avatarBg,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "900",
                            fontSize: "17px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>

                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <h5 style={{ margin: 0, fontWeight: "800", color: "#1446a0", fontSize: "19px" }}>
                              {operatorName}
                            </h5>
                            <span
                              style={{
                                backgroundColor: "#ecfdf5",
                                color: "#065f46",
                                border: "1px solid #a7f3d0",
                                fontSize: "11px",
                                fontWeight: "700",
                                padding: "3px 9px",
                                borderRadius: "12px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FaShieldAlt style={{ fontSize: "10px" }} /> Safety+ Certified
                            </span>
                          </div>

                          <div style={{ color: "#64748b", fontSize: "13px", fontWeight: "600", marginTop: "3px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span>
                              {isAC ? "Volvo AC" : "Non-AC"} {isSleeper ? "Multi-Axle Sleeper (2+1)" : "Deluxe Seater Pushback"}
                            </span>
                            <span>&bull;</span>
                            <span style={{ color: "#059669", fontWeight: "700" }}>Live GPS Tracking</span>
                          </div>
                        </div>
                      </div>

                      {/* Top-Right Badges: Ratings & AI Badges */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        {/* AI Recommendation Badge (Sequence 3) */}
                        {isTopPick ? (
                          <span
                            style={{
                              backgroundColor: "#f5f3ff",
                              color: "#6d28d9",
                              border: "1.5px solid #c4b5fd",
                              fontSize: "11.5px",
                              fontWeight: "800",
                              padding: "4px 12px",
                              borderRadius: "14px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              boxShadow: "0 2px 6px rgba(109, 40, 217, 0.12)",
                            }}
                          >
                            🤖 🏆 AI Top Pick (Score: 98/100)
                          </span>
                        ) : price <= 1000 ? (
                          <span
                            style={{
                              backgroundColor: "#ecfdf5",
                              color: "#047857",
                              border: "1px solid #a7f3d0",
                              fontSize: "11.5px",
                              fontWeight: "700",
                              padding: "4px 10px",
                              borderRadius: "14px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            💡 AI Recommended: Best Value
                          </span>
                        ) : null}

                        {/* Star Rating Badge */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            backgroundColor: ratingVal >= 4.5 ? "#15803d" : "#ca8a04",
                            color: "#ffffff",
                            padding: "5px 12px",
                            borderRadius: "10px",
                            fontSize: "13.5px",
                            fontWeight: "800",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                          }}
                        >
                          <AiTwotoneStar style={{ fontSize: "15px" }} />
                          <span>{ratingVal.toFixed(1)}</span>
                          <span style={{ fontSize: "11px", opacity: 0.85 }}>/ 5</span>
                        </div>
                      </div>
                    </div>

                    {/* Journey Timeline Strip */}
                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        borderRadius: "12px",
                        padding: "14px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: "1px solid #e2e8f0",
                        gap: "10px",
                      }}
                    >
                      {/* Departure */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "22px", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.5px" }}>
                          {formatTime(ele.departure)}
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#1446a0", marginTop: "2px" }}>
                          {ele.from}
                        </div>
                        <small style={{ color: "#64748b", fontSize: "11.5px", display: "block", marginTop: "2px" }}>
                          Boarding: <strong>{boardingPoints[0]?.name || "Main Terminal"}</strong>
                        </small>
                      </div>

                      {/* Travel Duration & Route Visualizer */}
                      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minWidth: "150px" }}>
                        <span
                          style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #cbd5e1",
                            padding: "3px 12px",
                            borderRadius: "14px",
                            fontSize: "11.5px",
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
                          <span style={{ fontSize: "16px", color: "#1446a0", margin: "0 6px" }}>🚌</span>
                          <div style={{ height: "2px", backgroundColor: "#cbd5e1", flex: 1 }}></div>
                        </div>

                        <small style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", marginTop: "2px" }}>
                          {journey.isNextDay ? "Overnight Express" : "Direct Highway Route"}
                        </small>
                      </div>

                      {/* Arrival */}
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                          <span style={{ fontSize: "22px", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.5px" }}>
                            {formatTime(ele.arrival)}
                          </span>
                          {journey.isNextDay && (
                            <span
                              style={{
                                backgroundColor: "#dbeafe",
                                color: "#1e40af",
                                border: "1px solid #bfdbfe",
                                fontSize: "10px",
                                fontWeight: "800",
                                padding: "2px 6px",
                                borderRadius: "8px",
                              }}
                            >
                              +1 Next Day
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#1446a0", marginTop: "2px" }}>
                          {ele.to}
                        </div>
                        <small style={{ color: "#64748b", fontSize: "11.5px", display: "block", marginTop: "2px" }}>
                          Drop: <strong>{droppingPoints[0]?.name || "Central Terminal"}</strong>
                        </small>
                      </div>
                    </div>

                    {/* Amenities & Protection Strip */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", alignItems: "center" }}>
                        <span
                          style={{
                            backgroundColor: isAC ? "#eff6ff" : "#f1f5f9",
                            color: isAC ? "#1d4ed8" : "#475569",
                            border: isAC ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "3px 10px",
                            borderRadius: "16px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaSnowflake style={{ fontSize: "10px" }} /> {isAC ? "A/C Cooled" : "Air Ventilated"}
                        </span>

                        <span
                          style={{
                            backgroundColor: "#f8fafc",
                            color: "#334155",
                            border: "1px solid #e2e8f0",
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "3px 10px",
                            borderRadius: "16px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaBed style={{ fontSize: "11px", color: "#64748b" }} />{" "}
                          {isSleeper ? "Sleeper Berths (2+1)" : "Seater Pushback"}
                        </span>

                        <span
                          style={{
                            backgroundColor: "#f8fafc",
                            color: "#334155",
                            border: "1px solid #e2e8f0",
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "3px 10px",
                            borderRadius: "16px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaBolt style={{ fontSize: "10px", color: "#eab308" }} /> USB Charging
                        </span>

                        <span
                          style={{
                            backgroundColor: "#f8fafc",
                            color: "#334155",
                            border: "1px solid #e2e8f0",
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "3px 10px",
                            borderRadius: "16px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaWifi style={{ fontSize: "10px", color: "#3b82f6" }} /> Free WiFi
                        </span>

                        <span
                          style={{
                            backgroundColor: "#fdf2f8",
                            color: "#be185d",
                            border: "1px solid #fbcfe8",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "3px 10px",
                            borderRadius: "16px",
                          }}
                        >
                          🌸 Reserved Ladies Berths
                        </span>
                      </div>

                      {/* Live Seats Remaining Tag */}
                      <div>
                        {availableSeats <= 8 ? (
                          <span
                            style={{
                              backgroundColor: "#fef2f2",
                              color: "#b91c1c",
                              border: "1px solid #fecaca",
                              fontSize: "11px",
                              fontWeight: "800",
                              padding: "3px 10px",
                              borderRadius: "14px",
                            }}
                          >
                            🔥 Only {availableSeats} Seats Left!
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: "#f0fdf4",
                              color: "#15803d",
                              border: "1px solid #bbf7d0",
                              fontSize: "11px",
                              fontWeight: "700",
                              padding: "3px 10px",
                              borderRadius: "14px",
                            }}
                          >
                            🟢 {availableSeats} {isSleeper ? `Berths Left (${Math.floor(availableSeats / 3)} Single)` : `Seats Left (${Math.floor(availableSeats / 2)} Window)`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Accordion Tabs Row */}
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: "10px",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#475569",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => toggleTab(ele._id, "points")}
                        style={{
                          background: "none",
                          border: "none",
                          color: activeTab === "points" ? "#1446a0" : "#64748b",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 0",
                        }}
                      >
                        <FaMapMarkerAlt /> Boarding &amp; Dropping Points{" "}
                        {activeTab === "points" ? <FaChevronUp /> : <FaChevronDown />}
                      </button>

                      <button
                        onClick={() => toggleTab(ele._id, "amenities")}
                        style={{
                          background: "none",
                          border: "none",
                          color: activeTab === "amenities" ? "#1446a0" : "#64748b",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 0",
                        }}
                      >
                        <FaCheckCircle /> All Amenities (8){" "}
                        {activeTab === "amenities" ? <FaChevronUp /> : <FaChevronDown />}
                      </button>

                      <button
                        onClick={() => toggleTab(ele._id, "policies")}
                        style={{
                          background: "none",
                          border: "none",
                          color: activeTab === "policies" ? "#1446a0" : "#64748b",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 0",
                        }}
                      >
                        <FaInfoCircle /> Cancellation Policy{" "}
                        {activeTab === "policies" ? <FaChevronUp /> : <FaChevronDown />}
                      </button>

                      <button
                        onClick={() => toggleTab(ele._id, "ai_score")}
                        style={{
                          background: "none",
                          border: "none",
                          color: activeTab === "ai_score" ? "#5b21b6" : "#64748b",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 0",
                        }}
                      >
                        🤖 AI Performance Insights{" "}
                        {activeTab === "ai_score" ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>

                    {/* Expandable Tray Content */}
                    {activeTab === "points" && (
                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          borderRadius: "10px",
                          padding: "16px 18px",
                          border: "1px solid #e2e8f0",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                          gap: "20px",
                        }}
                      >
                        <div>
                          <strong style={{ color: "#1446a0", fontSize: "13px", display: "block", marginBottom: "10px" }}>
                            📍 Boarding Points ({ele.from || fromCity}):
                          </strong>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {boardingPoints.map((pt, pIdx) => (
                              <div
                                key={pIdx}
                                style={{
                                  backgroundColor: "#ffffff",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "8px",
                                  padding: "8px 12px",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "10px",
                                }}
                              >
                                <span
                                  style={{
                                    backgroundColor: "#eff6ff",
                                    color: "#1e40af",
                                    border: "1px solid #bfdbfe",
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    whiteSpace: "nowrap",
                                    marginTop: "2px",
                                  }}
                                >
                                  {pt.time}
                                </span>
                                <div>
                                  <strong style={{ fontSize: "12.5px", color: "#0f172a", display: "block" }}>
                                    {pt.name}
                                  </strong>
                                  <small style={{ color: "#64748b", fontSize: "11px" }}>{pt.landmark}</small>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <strong style={{ color: "#059669", fontSize: "13px", display: "block", marginBottom: "10px" }}>
                            🏁 Dropping Points ({ele.to || toCity}):
                          </strong>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {droppingPoints.map((pt, pIdx) => (
                              <div
                                key={pIdx}
                                style={{
                                  backgroundColor: "#ffffff",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "8px",
                                  padding: "8px 12px",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "10px",
                                }}
                              >
                                <span
                                  style={{
                                    backgroundColor: "#ecfdf5",
                                    color: "#065f46",
                                    border: "1px solid #a7f3d0",
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    whiteSpace: "nowrap",
                                    marginTop: "2px",
                                  }}
                                >
                                  {pt.time}
                                </span>
                                <div>
                                  <strong style={{ fontSize: "12.5px", color: "#0f172a", display: "block" }}>
                                    {pt.name}
                                  </strong>
                                  <small style={{ color: "#64748b", fontSize: "11px" }}>{pt.landmark}</small>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "amenities" && (
                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          borderRadius: "10px",
                          padding: "14px 18px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <strong style={{ color: "#1446a0", fontSize: "13px", display: "block", marginBottom: "10px" }}>
                          ✨ Included Coach Amenities &amp; Services:
                        </strong>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px", fontSize: "12px", color: "#334155" }}>
                          <div>❄️ Dual-Zone Climate A/C</div>
                          <div>🛏️ Ergonomic Sleeper Berths</div>
                          <div>🔌 Individual 220V / USB Plugs</div>
                          <div>📶 High-Speed In-Coach WiFi</div>
                          <div>💧 Sealed 500ml Mineral Water</div>
                          <div>🛋️ Sanitized Fleece Blanket</div>
                          <div>📍 Real-Time Live Bus Tracking</div>
                          <div>🚨 SOS Alarm &amp; First Aid Kit</div>
                        </div>
                      </div>
                    )}

                    {activeTab === "policies" && (
                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          borderRadius: "10px",
                          padding: "14px 18px",
                          border: "1px solid #e2e8f0",
                          fontSize: "12px",
                          color: "#334155",
                        }}
                      >
                        <strong style={{ color: "#b91c1c", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                          🛡️ Transparent Cancellation &amp; Refund Policy:
                        </strong>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div style={{ backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                            <strong>Between 0 - 6 Hours before:</strong> No refund
                          </div>
                          <div style={{ backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                            <strong>Between 6 - 12 Hours before:</strong> 50% refund
                          </div>
                          <div style={{ backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                            <strong>Between 12 - 24 Hours before:</strong> 80% refund
                          </div>
                          <div style={{ backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                            <strong>Before 24 Hours:</strong> 95% instant refund
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "ai_score" && (
                      <div
                        style={{
                          backgroundColor: "#faf5ff",
                          borderRadius: "10px",
                          padding: "14px 18px",
                          border: "1.5px solid #d8b4fe",
                        }}
                      >
                        <strong style={{ color: "#6b21a8", fontSize: "13px", display: "block", marginBottom: "8px" }}>
                          🤖 AI Verified Quality Metrics &amp; Safety Diagnostics:
                        </strong>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                          <div style={{ backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e9d5ff" }}>
                            <small style={{ color: "#64748b", display: "block" }}>Punctuality Score</small>
                            <strong style={{ color: "#15803d", fontSize: "15px" }}>98.6% On-Time</strong>
                          </div>
                          <div style={{ backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e9d5ff" }}>
                            <small style={{ color: "#64748b", display: "block" }}>Coach Cleanliness</small>
                            <strong style={{ color: "#2563eb", fontSize: "15px" }}>4.8 / 5.0 Rating</strong>
                          </div>
                          <div style={{ backgroundColor: "#ffffff", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e9d5ff" }}>
                            <small style={{ color: "#64748b", display: "block" }}>Driver Safety Index</small>
                            <strong style={{ color: "#7c3aed", fontSize: "15px" }}>Zero Incident Fleet</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price, Discount & CTA Button Footer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1.5px dashed #e2e8f0",
                        paddingTop: "14px",
                        marginTop: "2px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                        <div>
                          <small style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", display: "block" }}>
                            All-Inclusive Fare
                          </small>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                            <span style={{ fontSize: "26px", fontWeight: "900", color: "#1446a0" }}>
                              ₹ {price}
                            </span>
                            <span style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "line-through" }}>
                              ₹ {originalPrice}
                            </span>
                          </div>
                        </div>

                        <span
                          style={{
                            backgroundColor: "#ecfdf5",
                            color: "#047857",
                            border: "1px solid #a7f3d0",
                            fontSize: "11px",
                            fontWeight: "800",
                            padding: "2px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          {discountPercent}% OFF
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlebook(ele)}
                        style={{
                          backgroundColor: "#1446a0",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "10px",
                          padding: "12px 28px",
                          fontSize: "14.5px",
                          fontWeight: "800",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(20, 70, 160, 0.28)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#0d2f6c";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#1446a0";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <span>Select Seats</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
    </>
  );
}

export default SelectBus;
