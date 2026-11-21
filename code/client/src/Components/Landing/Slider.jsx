import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { error, success } from "../../Utils/notification";
import { formatTime } from "../../Utils/converObject";
import {
  FaBus,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaExchangeAlt,
  FaShieldAlt,
  FaFemale,
  FaMale,
  FaCheckCircle,
  FaRobot,
  FaTimes,
  FaPrint,
  FaTicketAlt,
  FaCheck,
  FaArrowRight,
  FaExternalLinkAlt,
  FaThermometerHalf,
  FaPumpSoap,
  FaHeadset,
} from "react-icons/fa";
import OriginalTicket from "../Ticket/OriginalTicket";

function Slider() {
  const [source, setsource] = useState("");
  const [destination, setdestination] = useState("");
  const [date, setdate] = useState("");
  const [showName, setShowNames] = useState(false);
  const [showNamedes, setShowNamesdes] = useState(false);
  const [output, setOutput] = useState([]);
  const [outputdes, setOutputdes] = useState([]);
  const [dateinfo, setdateinfo] = useState({});
  const [cityClicked, setCityclicked] = useState(false);
  const [CityDesclicked, setCityDesclicked] = useState(false);

  // Interactive Modal State for the 4 Feature Cards
  const [activeModal, setActiveModal] = useState(null); // 'safety' | 'gender' | 'pnr'

  // PNR Lookup Modal State
  const [pnrInput, setPnrInput] = useState("");
  const [pnrLoading, setPnrLoading] = useState(false);
  const [pnrResult, setPnrResult] = useState(null);
  const [pnrError, setPnrError] = useState("");
  const [showOriginalTicketModal, setShowOriginalTicketModal] = useState(false);

  // Natural-Language AI Search State
  const [nlpQuery, setNlpQuery] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);

  const handleNlpSearch = async (e, customQuery) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = (customQuery || nlpQuery).trim();
    if (!query) {
      error("Please enter a route query (e.g. 'AC sleeper from Mumbai to Bengaluru tomorrow')");
      return;
    }
    setNlpLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/nlp-search`, { query });
      if (res.data?.searchUrl) {
        success(`🤖 ${res.data.explanation || "AI successfully routed your journey!"}`);
        navigate(res.data.searchUrl);
      } else {
        error("Could not recognize cities. Please check spelling.");
      }
    } catch (err) {
      console.error("NLP Search error:", err);
      error("AI search is currently busy. Please use the standard search form.");
    } finally {
      setNlpLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    let mindate = new Date().toISOString().split("T")[0];
    setdate(mindate);
    setdateinfo({
      mindate: mindate,
    });
  }, []);

  useEffect(() => {
    if (source === "") {
      setShowNames(false);
      return;
    }
    if (cityClicked === true) {
      setCityclicked(false);
      return;
    }
    let timerID = setTimeout(() => {
      handleGetRequest();
    }, 200);

    return () => {
      clearTimeout(timerID);
    };
  }, [source]);

  useEffect(() => {
    if (destination === "") {
      setShowNamesdes(false);
      return;
    }
    if (CityDesclicked === true) {
      setCityDesclicked(false);
      return;
    }
    let timerID = setTimeout(() => {
      handleGetRequestdes();
    }, 200);

    return () => {
      clearTimeout(timerID);
    };
  }, [destination]);

  const handleGetRequest = async () => {
    try {
      let res = await axios.post(`${API_BASE_URL}/city`, { source });
      setOutput(Array.isArray(res.data) ? res.data : []);
      setShowNames(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetRequestdes = async () => {
    try {
      let res = await axios.post(`${API_BASE_URL}/city`, { destination });
      setOutputdes(Array.isArray(res.data) ? res.data : []);
      setShowNamesdes(true);
    } catch (err) {
      console.log(err);
    }
  };

  function handleclicked() {
    if (!date || !destination.trim() || !source.trim()) {
      error("Please fill in departure city, destination, and date.");
      return;
    }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      error("Source and destination cannot be the same city.");
      return;
    }
    getcityinfo(source.trim(), destination.trim(), date);
  }

  async function getcityinfo(src, dest, dt) {
    try {
      let res = await axios.post(`${API_BASE_URL}/city/showcity`, {
        source: src,
        destination: dest,
        date: dt,
      });
      if (res.data.status === "success") {
        navigate({
          pathname: "/selectbus",
          search: `?from=${encodeURIComponent(src)}&to=${encodeURIComponent(dest)}&date=${dt}`,
        });
      } else {
        error(res.data.data || "City Not Found");
      }
    } catch (err) {
      console.log(err);
      error("Unable to verify route. Please try again.");
    }
  }

  function handlecityclicked(name) {
    setCityclicked(true);
    setsource(name);
    setShowNames(false);
  }

  function handlecityclicked1(name) {
    setCityDesclicked(true);
    setdestination(name);
    setShowNamesdes(false);
  }

  // 1-Click Swap Source & Destination
  const handleSwap = () => {
    const temp = source;
    setsource(destination);
    setdestination(temp);
    setShowNames(false);
    setShowNamesdes(false);
  };

  // Quick Date Shortcut (Today / Tomorrow)
  const setQuickDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setdate(d.toISOString().split("T")[0]);
  };

  // Quick Popular Route Selection
  const handleSelectRoute = (fromCity, toCity) => {
    setsource(fromCity);
    setdestination(toCity);
    setShowNames(false);
    setShowNamesdes(false);
  };

  // Card 4: Trigger BlueBot AI
  const handleOpenBlueBot = (initialQuery) => {
    window.dispatchEvent(
      new CustomEvent("open-bluebot", {
        detail: {
          initialQuery: initialQuery || "Hi! Can you help me check bus tickets and seat booking options?",
        },
      })
    );
  };

  // Live PNR Lookup Handler
  const handlePnrSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = pnrInput.trim();
    if (!query) {
      setPnrError("Please enter a valid 6-digit PNR (e.g. PNR-E210FC or E210FC).");
      return;
    }

    setPnrLoading(true);
    setPnrError("");
    setPnrResult(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/order/ticket/${encodeURIComponent(query)}`);
      if (res.data?.ticket) {
        setPnrResult(res.data.ticket);
        success("Booking details found!");
      } else {
        setPnrError("No confirmed booking found for this PNR. Please check and try again.");
      }
    } catch (err) {
      console.error("PNR lookup error:", err);
      setPnrError(
        err.response?.data?.error ||
          "Unable to find booking with this PNR. Please verify the code or check My Tickets."
      );
    } finally {
      setPnrLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", backgroundColor: "#f8fafc", paddingBottom: "35px" }}>
      {/* ================= HERO SECTION ================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #071938 0%, #0c2d68 50%, #13449c 100%)",
          padding: "50px 20px 85px 20px",
          color: "#ffffff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative background circles */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            right: "8%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1100px", margin: "auto", position: "relative", zIndex: 2 }}>
          {/* Top Trust Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(8px)",
              padding: "6px 16px",
              borderRadius: "30px",
              fontSize: "13px",
              fontWeight: "700",
              color: "#38bdf8",
              marginBottom: "16px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span>🇮🇳</span> India's Premier Online Bus Ticket Booking Site
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: "900",
              letterSpacing: "-0.5px",
              margin: "0 0 12px 0",
              lineHeight: "1.2",
            }}
          >
            Book Bus Tickets Online
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: "680px",
              margin: "0 auto 35px auto",
              lineHeight: "1.6",
            }}
          >
            Choose from over 300+ daily luxury AC sleeper and seater buses with live Male (Blue) &amp; Female (Pink) seat tracking.
          </p>
        </div>
      </div>

      {/* ================= SEARCH CARD (ELEVATED FLOATING) ================= */}
      <div style={{ maxWidth: "1140px", margin: "-55px auto 0 auto", padding: "0 15px", position: "relative", zIndex: 10 }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            boxShadow: "0 16px 40px rgba(13, 47, 108, 0.18)",
            padding: "24px 28px",
            border: "1px solid rgba(226, 232, 240, 0.9)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr auto 1.2fr 1fr 1.1fr",
              alignItems: "center",
              gap: "12px",
            }}
            className="search-grid-container"
          >
            {/* 1. FROM INPUT */}
            <div style={{ position: "relative" }}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaBus style={{ color: "#2563eb", fontSize: "14px" }} /> From
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mumbai, Pune, Goa"
                value={source}
                onFocus={() => {
                  setShowNamesdes(false);
                  handleGetRequest();
                }}
                onChange={(e) => {
                  setsource(e.target.value);
                  setShowNamesdes(false);
                }}
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                }}
              />

              {/* Autocomplete Dropdown */}
              {showName && output.length !== 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    maxHeight: "220px",
                    overflowY: "auto",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    border: "1px solid #e2e8f0",
                    zIndex: 1000,
                    marginTop: "4px",
                  }}
                >
                  {output.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handlecityclicked(item.name)}
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f7ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <strong style={{ fontSize: "14px", color: "#1e293b" }}>{item.name}</strong>
                      <small style={{ color: "#64748b", fontSize: "12px" }}>{item.state || "India"}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SWAP BUTTON */}
            <div style={{ textAlign: "center", paddingTop: "18px" }}>
              <button
                type="button"
                onClick={handleSwap}
                title="Swap From and To cities"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "1.5px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                  color: "#1446a0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1446a0";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "rotate(180deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.color = "#1446a0";
                  e.currentTarget.style.transform = "rotate(0deg)";
                }}
              >
                <FaExchangeAlt style={{ fontSize: "14px" }} />
              </button>
            </div>

            {/* 2. TO INPUT */}
            <div style={{ position: "relative" }}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaMapMarkerAlt style={{ color: "#ef4444", fontSize: "14px" }} /> To
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Jalgaon, Goa, Bengaluru"
                value={destination}
                onFocus={() => {
                  setShowNames(false);
                  handleGetRequestdes();
                }}
                onChange={(e) => {
                  setdestination(e.target.value);
                  setShowNames(false);
                }}
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                }}
              />

              {/* Autocomplete Dropdown */}
              {showNamedes && outputdes.length !== 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    maxHeight: "220px",
                    overflowY: "auto",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    border: "1px solid #e2e8f0",
                    zIndex: 1000,
                    marginTop: "4px",
                  }}
                >
                  {outputdes.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handlecityclicked1(item.name)}
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f7ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <strong style={{ fontSize: "14px", color: "#1e293b" }}>{item.name}</strong>
                      <small style={{ color: "#64748b", fontSize: "12px" }}>{item.state || "India"}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. DATE OF JOURNEY */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaCalendarAlt style={{ color: "#10b981", fontSize: "14px" }} /> Date
                </label>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setQuickDate(0)}
                    style={{
                      border: "none",
                      backgroundColor: "#e2e8f0",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 6px",
                      cursor: "pointer",
                      color: "#334155",
                    }}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(1)}
                    style={{
                      border: "none",
                      backgroundColor: "#e2e8f0",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 6px",
                      cursor: "pointer",
                      color: "#334155",
                    }}
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
              <input
                type="date"
                className="form-control"
                value={date}
                min={dateinfo.mindate}
                onChange={(e) => setdate(e.target.value)}
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#1e293b",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                }}
              />
            </div>

            {/* 4. SEARCH BUTTON */}
            <div style={{ paddingTop: "18px" }}>
              <button
                type="button"
                onClick={handleclicked}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #d90429 0%, #ef233c 100%)",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "800",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 6px 18px rgba(217, 4, 41, 0.35)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 22px rgba(217, 4, 41, 0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(217, 4, 41, 0.35)";
                }}
              >
                <FaSearch style={{ fontSize: "15px" }} /> SEARCH BUSES
              </button>
            </div>
          </div>

          {/* Quick Route Shortcuts */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px dashed #e2e8f0",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
              Popular Routes:
            </span>
            {[
              { from: "Mumbai", to: "Pune", label: "Mumbai ➔ Pune" },
              { from: "Mumbai", to: "Bengaluru", label: "Mumbai ➔ Bengaluru" },
              { from: "Delhi", to: "Jaipur", label: "Delhi ➔ Jaipur" },
              { from: "Pune", to: "Goa", label: "Pune ➔ Goa" },
              { from: "Bengaluru", to: "Hyderabad", label: "Bengaluru ➔ Hyderabad" },
            ].map((route, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectRoute(route.from, route.to)}
                style={{
                  backgroundColor: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#1e40af",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e0e7ff";
                  e.currentTarget.style.borderColor = "#93c5fd";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f1f5f9";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
              >
                {route.label}
              </button>
            ))}
          </div>

          {/* Sequence 2: Natural-Language AI Bus Search Bar */}
          <div
            style={{
              marginTop: "16px",
              padding: "14px 18px",
              background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)",
              borderRadius: "12px",
              border: "1px solid #bfdbfe",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>✨</span>
                <strong style={{ fontSize: "13.5px", color: "#1e3a8a" }}>
                  AI Natural-Language Smart Search:
                </strong>
                <small style={{ color: "#64748b", fontSize: "12px" }}>
                  Type your route or click any query chip below
                </small>
              </div>
              <span
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontSize: "10.5px",
                  fontWeight: "800",
                  padding: "2px 8px",
                  borderRadius: "10px",
                }}
              >
                Sequence 02
              </span>
            </div>

            <form onSubmit={handleNlpSearch} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 'Need cheap AC sleeper bus from Pune to Jalgaon tonight'"
                value={nlpQuery}
                onChange={(e) => setNlpQuery(e.target.value)}
                style={{
                  fontSize: "14px",
                  borderRadius: "8px",
                  border: "1.5px solid #93c5fd",
                  backgroundColor: "#ffffff",
                  padding: "10px 14px",
                }}
              />
              <button
                type="submit"
                disabled={nlpLoading}
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0 22px",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                }}
              >
                {nlpLoading ? "Parsing with AI..." : "✨ AI Search →"}
              </button>
            </form>

            {/* Quick 1-Click NLP Search Query Chips */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px", alignItems: "center" }}>
              <small style={{ color: "#64748b", fontSize: "11px", fontWeight: "700" }}>Try Asking:</small>
              {[
                "Pune to Jalgaon AC sleeper tonight",
                "Pune to Jalgaon luxury bus tomorrow",
                "Mumbai to Bengaluru Volvo sleeper",
                "Cheapest bus from Pune to Jalgaon",
              ].map((chipText, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  onClick={() => {
                    setNlpQuery(chipText);
                    handleNlpSearch(null, chipText);
                  }}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "14px",
                    padding: "3px 10px",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#1e40af",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                >
                  ⚡ {chipText}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= 4 PILLARS FEATURE BAR (NOW FULLY INTERACTIVE & CLICKABLE) ================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginTop: "28px",
          }}
        >
          {/* Pillar 1: Safety+ Certified Buses */}
          <div
            onClick={() => setActiveModal("safety")}
            style={{
              backgroundColor: "#ffffff",
              padding: "18px 20px",
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
              border: "1.5px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(5, 150, 105, 0.15)";
              e.currentTarget.style.borderColor = "#10b981";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
            title="Click to view Safety+ Certified Protocols"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#ecfdf5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  flexShrink: 0,
                }}
              >
                <FaShieldAlt />
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "#1e293b", display: "block" }}>Safety+ Certified Buses</strong>
                <small style={{ color: "#64748b", fontSize: "12px" }}>Sanitized berths &amp; verified drivers</small>
              </div>
            </div>
            <span style={{ color: "#10b981", fontSize: "12px", fontWeight: "700" }}>➔</span>
          </div>

          {/* Pillar 2: Live Gender Seat Map */}
          <div
            onClick={() => setActiveModal("gender")}
            style={{
              backgroundColor: "#ffffff",
              padding: "18px 20px",
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
              border: "1.5px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(219, 39, 119, 0.15)";
              e.currentTarget.style.borderColor = "#f472b6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
            title="Click to learn how Male & Female seats work"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#fdf2f8",
                  color: "#db2777",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  flexShrink: 0,
                }}
              >
                <FaFemale />
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "#1e293b", display: "block" }}>Live Gender Seat Map</strong>
                <small style={{ color: "#64748b", fontSize: "12px" }}>Pink (Ladies) &amp; Blue (Male) berths</small>
              </div>
            </div>
            <span style={{ color: "#db2777", fontSize: "12px", fontWeight: "700" }}>➔</span>
          </div>

          {/* Pillar 3: Instant PNR & Tickets */}
          <div
            onClick={() => setActiveModal("pnr")}
            style={{
              backgroundColor: "#ffffff",
              padding: "18px 20px",
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
              border: "1.5px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 99, 235, 0.15)";
              e.currentTarget.style.borderColor = "#60a5fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
            title="Click to check your PNR status or view tickets"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  flexShrink: 0,
                }}
              >
                <FaCheckCircle />
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "#1e293b", display: "block" }}>Instant PNR &amp; Tickets</strong>
                <small style={{ color: "#64748b", fontSize: "12px" }}>100% confirmed printable tickets</small>
              </div>
            </div>
            <span style={{ color: "#2563eb", fontSize: "12px", fontWeight: "700" }}>➔</span>
          </div>

          {/* Pillar 4: BlueBot AI Support */}
          <div
            onClick={() => handleOpenBlueBot("Hi BlueBot! How do I book multiple tickets with mixed male and female passengers?")}
            style={{
              backgroundColor: "#ffffff",
              padding: "18px 20px",
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
              border: "1.5px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(124, 58, 237, 0.15)";
              e.currentTarget.style.borderColor = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
            title="Click to open BlueBot AI assistant"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#f5f3ff",
                  color: "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  flexShrink: 0,
                }}
              >
                <FaRobot />
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "#1e293b", display: "block" }}>BlueBot AI Support</strong>
                <small style={{ color: "#64748b", fontSize: "12px" }}>24/7 intelligent PNR &amp; travel help</small>
              </div>
            </div>
            <span style={{ color: "#7c3aed", fontSize: "12px", fontWeight: "700" }}>● Open</span>
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: SAFETY+ CERTIFIED PROTOCOLS ================= */}
      {activeModal === "safety" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              maxWidth: "640px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              border: "1px solid #e2e8f0",
              padding: "28px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              <FaTimes />
            </button>

            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  backgroundColor: "#ecfdf5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                <FaShieldAlt />
              </div>
              <div>
                <h4 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                  Safety+ Certified Program
                </h4>
                <small style={{ color: "#059669", fontWeight: "700" }}>
                  Official 5-Tier Sanitization &amp; Security Protocol
                </small>
              </div>
            </div>

            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
              All buses bearing the <strong>Safety+</strong> certification undergo thorough multi-point checks before every departure to guarantee 100% hygiene, passenger well-being, and safe highway transit.
            </p>

            {/* 5 Safety Pillars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {[
                {
                  icon: <FaPumpSoap style={{ color: "#059669" }} />,
                  title: "Deep Sanitization & Disinfection",
                  desc: "Hospital-grade sanitization of berths, pillows, grab handles, and steering compartments prior to every boarding.",
                },
                {
                  icon: <FaThermometerHalf style={{ color: "#2563eb" }} />,
                  title: "Driver & Crew Thermal Logging",
                  desc: "Mandatory temperature screenings and health logs maintained for all bus drivers, technicians, and attendants.",
                },
                {
                  icon: <FaShieldAlt style={{ color: "#db2777" }} />,
                  title: "Ladies Safety Berths Protection",
                  desc: "Female-exclusive pink sleeper berths designed to prevent unauthorized male adjacent bookings.",
                },
                {
                  icon: <FaCheckCircle style={{ color: "#7c3aed" }} />,
                  title: "Clean Fresh-Air AC Cycling",
                  desc: "Enhanced HEPA cabin air conditioning circulation ensuring continuous clean air flow throughout night journeys.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    backgroundColor: "#f8fafc",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontSize: "18px", marginTop: "2px" }}>{item.icon}</div>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#1e293b", display: "block" }}>
                      {item.title}
                    </strong>
                    <small style={{ color: "#64748b", fontSize: "12px", lineHeight: "1.4" }}>
                      {item.desc}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                const el = document.querySelector(".search-grid-container");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#059669",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Search Safety+ Certified Buses &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: GENDER-AWARE SEAT MAP GUIDE ================= */}
      {activeModal === "gender" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              maxWidth: "640px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              border: "1px solid #e2e8f0",
              padding: "28px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              <FaTimes />
            </button>

            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  backgroundColor: "#fdf2f8",
                  color: "#db2777",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                <FaFemale />
              </div>
              <div>
                <h4 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                  Live Gender Seat Map Guide
                </h4>
                <small style={{ color: "#db2777", fontWeight: "700" }}>
                  Visual Berth Allocation: Ladies (Pink) &amp; Male (Blue)
                </small>
              </div>
            </div>

            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", marginBottom: "18px" }}>
              BlueBus introduces industry-leading seat color-coding. When selecting berths, each seat clearly indicates its availability and passenger gender.
            </p>

            {/* Visual Legend Showcase */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              {/* Pink Female Card */}
              <div
                style={{
                  backgroundColor: "#fdf2f8",
                  border: "1.5px solid #f472b6",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <FaFemale style={{ color: "#db2777", fontSize: "18px" }} />
                  <strong style={{ color: "#9d174d", fontSize: "14px" }}>Pink Berth (Ladies)</strong>
                </div>
                <small style={{ color: "#831843", fontSize: "12px", lineHeight: "1.4", display: "block" }}>
                  Booked by a female traveler. Protected for women passengers. Men cannot book this berth.
                </small>
              </div>

              {/* Blue Male Card */}
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1.5px solid #93c5fd",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <FaMale style={{ color: "#2563eb", fontSize: "18px" }} />
                  <strong style={{ color: "#1e40af", fontSize: "14px" }}>Blue Berth (Male)</strong>
                </div>
                <small style={{ color: "#1e3a8a", fontSize: "12px", lineHeight: "1.4", display: "block" }}>
                  Booked by a male traveler. Tagged clearly for coach seat distribution and privacy.
                </small>
              </div>

              {/* Green Selected Card */}
              <div
                style={{
                  backgroundColor: "#ecfdf5",
                  border: "1.5px solid #6ee7b7",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <FaCheck style={{ color: "#059669", fontSize: "15px" }} />
                  <strong style={{ color: "#065f46", fontSize: "14px" }}>Green Berth (Selected)</strong>
                </div>
                <small style={{ color: "#064e3b", fontSize: "12px", lineHeight: "1.4", display: "block" }}>
                  Currently in your cart. You can select multiple berths (e.g. Seat 1 and Seat 2) together.
                </small>
              </div>

              {/* White Available Card */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#1e293b" }}>1</span>
                  <strong style={{ color: "#1e293b", fontSize: "14px" }}>White Berth (Available)</strong>
                </div>
                <small style={{ color: "#64748b", fontSize: "12px", lineHeight: "1.4", display: "block" }}>
                  Open for booking. Click any white berth on Lower or Upper deck to add to your journey.
                </small>
              </div>
            </div>

            {/* Simultaneous Multi-Passenger Booking Notice */}
            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px dashed #86efac",
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "20px",
              }}
            >
              <strong style={{ color: "#166534", fontSize: "13px", display: "block", marginBottom: "4px" }}>
                👥 Simultaneous Male + Female Bookings Supported:
              </strong>
              <small style={{ color: "#14532d", fontSize: "12px", lineHeight: "1.5", display: "block" }}>
                Booking for a couple or family? Select 2 seats at once (e.g. Seats 1 &amp; 2). In Step 1, designate Seat 1 as Male and Seat 2 as Female. The system tags each seat individually in the database and renders both colors simultaneously!
              </small>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                handleSelectRoute("Mumbai", "Pune");
                const el = document.querySelector(".search-grid-container");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Try Seat Selection (Mumbai ➔ Pune) &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: INSTANT PNR STATUS & BOARDING PASS ================= */}
      {activeModal === "pnr" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              maxWidth: "620px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              border: "1px solid #e2e8f0",
              padding: "28px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              <FaTimes />
            </button>

            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                <FaCheckCircle />
              </div>
              <div>
                <h4 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>
                  Instant PNR &amp; Ticket Status
                </h4>
                <small style={{ color: "#2563eb", fontWeight: "700" }}>
                  Live Boarding Pass Lookup &amp; Verification
                </small>
              </div>
            </div>

            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5", marginBottom: "16px" }}>
              Enter your 6-digit PNR code or full Order ID to check your live booking status, seat numbers, and print your boarding ticket.
            </p>

            {/* PNR Search Form */}
            <form onSubmit={handlePnrSearch} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. PNR-E210FC or 6-digit code"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                  }}
                />
                <button
                  type="submit"
                  disabled={pnrLoading}
                  style={{
                    backgroundColor: "#1446a0",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0 22px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {pnrLoading ? "Searching..." : "Check Status"}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {pnrError && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fca5a5",
                  color: "#b91c1c",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                ⚠️ {pnrError}
              </div>
            )}

            {/* Result Ticket Card */}
            {pnrResult && (
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1.5px solid #bbf7d0",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px dashed #cbd5e1",
                    paddingBottom: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                      PNR Number
                    </span>
                    <div style={{ fontSize: "18px", fontWeight: "900", color: "#1446a0" }}>
                      {pnrResult.pnr}
                    </div>
                  </div>
                  <span className="badge bg-success" style={{ fontSize: "12px", padding: "6px 10px" }}>
                    CONFIRMED
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px", marginBottom: "12px" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>Route:</span>
                    <br />
                    <strong>{pnrResult.journey?.from} ➔ {pnrResult.journey?.to}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Travel Date:</span>
                    <br />
                    <strong>
                      {pnrResult.journey?.date ? new Date(pnrResult.journey.date).toDateString() : "N/A"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Seats:</span>
                    <br />
                    <strong style={{ color: "#d90429", fontSize: "15px" }}>Seat {pnrResult.booking?.seats}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Fare Paid:</span>
                    <br />
                    <strong style={{ color: "#15803d", fontSize: "15px" }}>₹ {pnrResult.booking?.totalAmount}</strong>
                  </div>
                </div>

                {/* Multi-Passenger Roster */}
                {Array.isArray(pnrResult.passengers) && pnrResult.passengers.length > 0 && (
                  <div style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
                    <small style={{ fontWeight: "700", color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                      Passengers ({pnrResult.passengers.length}):
                    </small>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {pnrResult.passengers.map((p, idx) => {
                        const isFem = (p.gender || "").toLowerCase() === "female";
                        return (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                            <span><strong>Seat {p.seat}:</strong> {p.name} ({p.age} yrs)</span>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                padding: "2px 6px",
                                borderRadius: "8px",
                                backgroundColor: isFem ? "#fce7f3" : "#dbeafe",
                                color: isFem ? "#be185d" : "#1d4ed8",
                              }}
                            >
                              {isFem ? "🌸 Female" : "🔵 Male"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setShowOriginalTicketModal(true)}
                    style={{
                      flex: 1.2,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#1446a0",
                      color: "#ffffff",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(20, 70, 160, 0.25)",
                    }}
                  >
                    <FaTicketAlt /> View &amp; Download Ticket PDF
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      navigate("/myticket");
                    }}
                    style={{
                      flex: 0.8,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#ffffff",
                      color: "#334155",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <FaTicketAlt /> My Tickets
                  </button>
                </div>
              </div>
            )}

            {/* Quick Link to My Tickets */}
            <div style={{ textAlign: "center", borderTop: "1px dashed #e2e8f0", paddingTop: "14px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Want to see all your booked tickets?{" "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  navigate("/myticket");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1446a0",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Open My Tickets Page &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Original E-Ticket Modal from PNR Search */}
      {showOriginalTicketModal && pnrResult && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(5px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 10px",
            overflowY: "auto",
          }}
          onClick={() => setShowOriginalTicketModal(false)}
        >
          <div
            style={{
              maxWidth: "860px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              borderRadius: "18px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <OriginalTicket
              ticketData={{
                _id: pnrResult._id || pnrResult.orderId,
                pnr: pnrResult.pnr,
                busDetails: {
                  name: pnrResult.journey?.busName || "IntrCity SmartBus",
                  from: pnrResult.journey?.from || "Pune",
                  to: pnrResult.journey?.to || "Jalgaon",
                  departure: pnrResult.journey?.departure || "23:30",
                  arrival: pnrResult.journey?.arrival || "06:00",
                },
                ticketSummary: {
                  ticket: pnrResult.booking?.seats,
                  date: pnrResult.journey?.date,
                  amount: pnrResult.booking?.totalAmount,
                },
                passengers: pnrResult.passengers,
                userDetails: pnrResult.passenger,
                paymentDetails: {
                  amount: pnrResult.booking?.totalAmount,
                },
              }}
              onClose={() => setShowOriginalTicketModal(false)}
              showCloseButton={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Slider;
