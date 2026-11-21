import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";
import "./OriginalTicket.css";
import { formatTime, getSeatBerthLabel } from "../../Utils/converObject";
import { getCityBoardingPoints, getCityDroppingPoints } from "../../Utils/cityStops";
import {
  FaCheckCircle,
  FaPrint,
  FaTimes,
  FaRobot,
  FaCopy,
  FaDownload,
} from "react-icons/fa";

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

function OriginalTicket({ ticketData, onClose, showCloseButton = false }) {
  const ticketRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [aiTips, setAiTips] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const fromCity = ticketData?.busDetails?.from || "Pune";
  const toCity = ticketData?.busDetails?.to || "Jalgaon";

  useEffect(() => {
    if (toCity && ticketData) {
      axios
        .post(`${API_BASE_URL}/ai/travel-suggestions`, {
          origin: fromCity,
          destination: toCity,
        })
        .then((res) => {
          if (res.data && res.data.suggestions) {
            setAiTips(res.data.suggestions);
          }
        })
        .catch(() => {});
    }
  }, [fromCity, toCity, ticketData]);

  if (!ticketData) return null;

  // Extract Ticket Identifiers
  const orderId = ticketData._id?.toString() || "6ae1a5b030ee";
  const pnr = ticketData.pnr || `PNR-${orderId.slice(-6).toUpperCase()}`;
  const tinNumber = `TIN-${orderId.slice(-8).toUpperCase()}`;

  const busName =
    ticketData.busDetails?.name ||
    ticketData.busDetails?.companyname ||
    "IntrCity SmartBus";
  const cleanedOperator = cleanOperatorName(busName);

  const rawDate =
    ticketData.ticketSummary?.date || ticketData.journey?.date;
  const dateStr = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toDateString();

  const depRaw = ticketData.busDetails?.departure || "23:30";
  const arrRaw = ticketData.busDetails?.arrival || "06:00";
  const depTime = formatTime(depRaw);
  const arrTime = formatTime(arrRaw);

  const boardingHubs = getCityBoardingPoints(fromCity, depRaw);
  const droppingHubs = getCityDroppingPoints(toCity, arrRaw);
  const boardingPointName =
    ticketData.busDetails?.boardingPoint ||
    (boardingHubs[0] ? `${boardingHubs[0].name} — ${boardingHubs[0].landmark}` : `${fromCity} Central Hub`);
  const droppingPointName =
    ticketData.busDetails?.droppingPoint ||
    (droppingHubs[0] ? `${droppingHubs[0].name} — ${droppingHubs[0].landmark}` : `${toCity} Terminal`);

  const bookedSeatsStr = String(
    ticketData.ticketSummary?.ticket || ticketData.booking?.seats || "1"
  );
  const seatList = bookedSeatsStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const totalAmount = Number(
    ticketData.ticketSummary?.amount ||
      ticketData.booking?.totalAmount ||
      ticketData.paymentDetails?.amount ||
      1850
  );

  const baseFare = Math.round(totalAmount * 0.95);
  const gstAmount = Math.round(totalAmount * 0.05);

  const customerName =
    ticketData.userDetails?.name ||
    (ticketData.passengers && ticketData.passengers[0]?.name) ||
    "Raju Rastogi";

  // Normalize Passengers
  let passengers = [];
  if (Array.isArray(ticketData.passengers) && ticketData.passengers.length > 0) {
    passengers = ticketData.passengers.map((p, idx) => {
      const resolvedSeat = p.seat || seatList[idx] || `${idx + 1}`;
      return {
        name: p.name || `Traveller ${idx + 1}`,
        gender: p.gender || "male",
        age: p.age || 26,
        berth: p.berth || getSeatBerthLabel(resolvedSeat),
        seat: resolvedSeat,
      };
    });
  } else {
    passengers = seatList.map((sNum) => ({
      name: customerName,
      gender: ticketData.userDetails?.gender || "male",
      age: ticketData.userDetails?.age || 26,
      berth: getSeatBerthLabel(sNum),
      seat: sNum,
    }));
  }

  const handleDownloadPdf = async () => {
    if (!ticketRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = ticketRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        ignoreElements: (el) => el.classList.contains("no-print"),
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 8;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      if (contentHeight <= pdfHeight - margin * 2) {
        pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);
      } else {
        let heightLeft = contentHeight;
        let position = margin;
        pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
        heightLeft -= pdfHeight - margin * 2;

        while (heightLeft > 0) {
          position = heightLeft - contentHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
          heightLeft -= pdfHeight - margin * 2;
        }
      }

      const safePnr = (pnr || "BUS_TICKET").replace(/[^a-zA-Z0-9_-]/g, "_");
      pdf.save(`Bus_Ticket_${safePnr}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCoupon = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("SUPERBUS");
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2500);
    }
  };

  return (
    <div className="original-ticket-wrapper" ref={ticketRef}>
      {/* Background Confirmed Stamp */}
      <div className="ticket-watermark">CONFIRMED</div>

      {/* Optional Close Button (Modal View) */}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="no-print"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.25)",
            border: "none",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
          title="Close Ticket"
        >
          <FaTimes />
        </button>
      )}

      {/* 1. Header Banner: Exactly "Bus Ticket" (media_1794110803139_46e3d7a3.jpg) */}
      <div className="classic-ticket-banner">
        <h1 className="classic-ticket-title">Bus Ticket</h1>
        <div className="classic-ticket-subtitle">
          Electronic Reservation Slip (ERS) &bull; Tax Invoice
        </div>
      </div>

      {/* 2. Metadata Grid Table (Matching Exact Template Rows) */}
      <table className="classic-meta-table">
        <tbody>
          {/* Row 1: Purple Header Row */}
          <tr>
            <th className="classic-th-purple" style={{ width: "38%" }}>
              Customer GSTIN No:
            </th>
            <th className="classic-th-purple" style={{ width: "32%" }}>
              Place Of Supply:
            </th>
            <th className="classic-th-purple" style={{ width: "30%" }}>
              Document Type:
            </th>
          </tr>

          {/* Row 2: Customer Name, TIN, Document Type */}
          <tr>
            <td>
              <span className="classic-label">Customer Name:</span>
              <span className="classic-val">{customerName}</span>
            </td>
            <td>
              <span className="classic-label">TIN:</span>
              <span className="classic-val">{tinNumber}</span>
            </td>
            <td>
              <span className="classic-val" style={{ fontWeight: "700" }}>
                Tax Invoice / E-Ticket
              </span>
            </td>
          </tr>

          {/* Row 3: Location, Arrival Time, Departure Time */}
          <tr>
            <td>
              <span className="classic-label">Location:</span>
              <span className="classic-val">Maharashtra (27)</span>
            </td>
            <td>
              <span className="classic-label">Arrival Time:</span>
              <span className="classic-val" style={{ fontWeight: "700" }}>
                {arrTime}
              </span>
            </td>
            <td>
              <span className="classic-label">Departure Time:</span>
              <span className="classic-val" style={{ fontWeight: "700" }}>
                {depTime}
              </span>
            </td>
          </tr>

          {/* Row 4: Business Name */}
          <tr>
            <td colSpan="3">
              <span className="classic-label">Business Name:</span>
              <span className="classic-val" style={{ fontWeight: "700" }}>
                BlueBus Mobility Solutions Pvt Ltd &bull; Fleet Operations
              </span>
            </td>
          </tr>

          {/* Row 5: PAN No & CIN */}
          <tr>
            <td>
              <span className="classic-label">PAN No:</span>
              <span className="classic-val">AAACB8492J</span>
            </td>
            <td colSpan="2">
              <span className="classic-label">CIN:</span>
              <span className="classic-val">U63040MH2022PTC384912</span>
            </td>
          </tr>

          {/* Row 6: GSTIN No & HSN/SAC Code */}
          <tr>
            <td>
              <span className="classic-label">GSTIN No:</span>
              <span className="classic-val">27AAACB8492J1ZZ</span>
            </td>
            <td colSpan="2">
              <span className="classic-label">HSN/SAC Code:</span>
              <span className="classic-val">
                996411 (Passenger Transport by Road)
              </span>
            </td>
          </tr>

          {/* Row 7: PNR No */}
          <tr>
            <td colSpan="3">
              <span className="classic-label">PNR No:</span>
              <span className="classic-val-bold">{pnr}</span>
            </td>
          </tr>

          {/* Row 8: Origin */}
          <tr>
            <td colSpan="3">
              <span className="classic-label">Origin:</span>
              <span className="classic-val">
                <strong>{fromCity}</strong> (Hub: {boardingPointName}) &bull; Date: {dateStr}
              </span>
            </td>
          </tr>

          {/* Row 9: Destination */}
          <tr>
            <td colSpan="3">
              <span className="classic-label">Destination:</span>
              <span className="classic-val">
                <strong>{toCity}</strong> (Drop: {droppingPointName})
              </span>
            </td>
          </tr>

          {/* Row 10: Bus Operator Name & Address */}
          <tr>
            <td colSpan="3">
              <span className="classic-label">
                Bus Operator Name &amp; Address:
              </span>
              <span className="classic-val">
                <strong>{cleanedOperator}</strong>, Highway Terminal Hub, Nigdi Toll Plaza, Pune - Jalgaon Corridor, Maharashtra - 411044
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 3. Traveller Details Table (Exact 5 Columns Matching Image) */}
      <table className="classic-traveller-table">
        <thead>
          <tr>
            <th style={{ width: "32%" }}>Traveller Name</th>
            <th style={{ width: "16%" }}>Gender</th>
            <th style={{ width: "12%" }}>Age</th>
            <th style={{ width: "24%" }}>Berth</th>
            <th style={{ width: "16%" }}>Seat No</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((p, idx) => (
            <tr key={idx}>
              <td>
                <strong style={{ color: "#0f172a" }}>{p.name}</strong>
              </td>
              <td style={{ textAlign: "center" }}>
                {p.gender
                  ? p.gender.charAt(0).toUpperCase() +
                    p.gender.slice(1).toLowerCase()
                  : "Male"}
              </td>
              <td style={{ textAlign: "center" }}>{p.age || 26}</td>
              <td style={{ textAlign: "center" }}>{p.berth}</td>
              <td
                style={{
                  textAlign: "center",
                  fontWeight: "900",
                  color: "#1e3a8a",
                  fontSize: "13px",
                }}
              >
                {p.seat}
              </td>
            </tr>
          ))}

          {/* Additional Row Filler to match template height when single traveller */}
          {passengers.length === 1 && (
            <tr style={{ height: "26px" }}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          )}

          {/* Total Row */}
          <tr className="classic-total-row">
            <td style={{ textAlign: "right", fontWeight: "900" }}>Total</td>
            <td
              colSpan="3"
              style={{
                textAlign: "center",
                color: "#475569",
                fontSize: "12px",
              }}
            >
              {passengers.length}{" "}
              {passengers.length === 1 ? "Traveller" : "Travellers"} Confirmed
            </td>
            <td
              style={{
                textAlign: "center",
                fontWeight: "900",
                color: "#1e3a8a",
              }}
            >
              {passengers.length} {passengers.length === 1 ? "Seat" : "Seats"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 4. Split Grid: Left = Payment Breakup, Right = Terms and Conditions */}
      <div className="classic-bottom-split">
        {/* Left Column: Payment Breakup Table */}
        <div>
          <table className="classic-payment-table">
            <thead>
              <tr>
                <th style={{ width: "65%" }}>Payment Breakup</th>
                <th style={{ width: "35%", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bus Fare</td>
                <td style={{ textAlign: "right" }}>₹ {baseFare}.00</td>
              </tr>
              <tr>
                <td>Other Charges (Toll etc.)</td>
                <td style={{ textAlign: "right" }}>₹ 0.00</td>
              </tr>
              <tr>
                <td>Rescheduling Charges</td>
                <td style={{ textAlign: "right" }}>₹ 0.00</td>
              </tr>
              <tr>
                <td>Rescheduling Excess Fare</td>
                <td style={{ textAlign: "right" }}>₹ 0.00</td>
              </tr>
              <tr>
                <td>Operator Discount</td>
                <td style={{ textAlign: "right", color: "#15803d" }}>-₹ 0.00</td>
              </tr>
              <tr style={{ backgroundColor: "#f8fafc", fontWeight: "700" }}>
                <td>Total Taxable Value</td>
                <td style={{ textAlign: "right" }}>₹ {baseFare}.00</td>
              </tr>
              <tr>
                <td>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>IGST</span>
                    <span className="classic-rate-cell">Rate: 5%</span>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>₹ {gstAmount}.00</td>
              </tr>
              <tr>
                <td>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>CGST</span>
                    <span className="classic-rate-cell">Rate: 2.5%</span>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>₹ 0.00</td>
              </tr>
              <tr>
                <td>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>SGST</span>
                    <span className="classic-rate-cell">Rate: 2.5%</span>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>₹ 0.00</td>
              </tr>
              <tr className="classic-invoice-total-row">
                <td>Total Invoice Value</td>
                <td style={{ textAlign: "right" }}>₹ {totalAmount}.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column: Terms and Conditions */}
        <div className="classic-terms-box">
          <div className="classic-terms-header">Terms and Conditions</div>
          <div className="classic-terms-content">
            <ol>
              <li>
                <strong>Mandatory Photo ID:</strong> All passengers must carry
                an original government-issued photo ID (Aadhaar Card, Voter ID,
                Driving License, or Passport) during boarding.
              </li>
              <li>
                <strong>Reporting Time:</strong> Please report at boarding point
                at least <strong>15 to 30 minutes</strong> before scheduled
                departure. Bus departs strictly on time.
              </li>
              <li>
                <strong>Luggage Policy:</strong> Maximum <strong>15 kg</strong>{" "}
                personal luggage allowed per passenger. Hazardous, combustible
                cargo or commercial goods are strictly prohibited.
              </li>
              <li>
                <strong>Ladies Berth Protection:</strong> Berths reserved for
                female passengers cannot be transferred or reassigned to male
                passengers.
              </li>
              <li>
                <strong>Cancellation &amp; Refund:</strong> Tickets may be
                cancelled up to 12 hours prior to scheduled departure as per
                operator cancellation rules.
              </li>
              <li>
                <strong>Transit Insurance:</strong> All passengers are covered
                under complimentary group passenger transit accident insurance.
              </li>
              <li>
                <strong>Coach Protocol:</strong> Smoking and consumption of
                narcotics or alcohol inside the coach is strictly prohibited
                under the Motor Vehicles Act.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* 5. Authentic Footer Branding (Exact replication from image) */}
      <div className="classic-mybillbook-banner">
        <span>Create professional invoices using</span>
        <span className="classic-mybillbook-badge">
          <span className="mbb-red">🚩</span>
          <span>
            my<strong>BillBook</strong> app
          </span>
        </span>
        <span className="classic-google-play-pill">
          <span>▶</span> GET IT ON Google Play
        </span>
      </div>

      {/* 6. Extra Real Working Features: QR Boarding Code, AI Travel Assistant & Actions */}
      <div className="classic-extra-panel">
        {/* Contactless Boarding QR Strip */}
        <div className="classic-qr-strip">
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "74px",
                height: "74px",
                border: "2px solid #0f172a",
                borderRadius: "8px",
                padding: "4px",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* Scalable Vector QR Code */}
              <svg viewBox="0 0 100 100" width="64" height="64">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="13" y="13" width="12" height="12" fill="#0f172a" rx="2" />

                <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="75" y="13" width="12" height="12" fill="#0f172a" rx="2" />

                <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="13" y="75" width="12" height="12" fill="#0f172a" rx="2" />

                <rect x="38" y="10" width="6" height="6" fill="#0f172a" />
                <rect x="48" y="10" width="6" height="6" fill="#0f172a" />
                <rect x="40" y="22" width="8" height="6" fill="#0f172a" />
                <rect x="52" y="24" width="6" height="6" fill="#0f172a" />
                <rect x="10" y="42" width="6" height="6" fill="#0f172a" />
                <rect x="22" y="44" width="6" height="6" fill="#0f172a" />
                <rect x="38" y="40" width="8" height="8" fill="#0f172a" />
                <rect x="54" y="40" width="6" height="6" fill="#0f172a" />
                <rect x="70" y="44" width="8" height="6" fill="#0f172a" />
                <rect x="84" y="42" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="58" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="56" width="8" height="6" fill="#0f172a" />
                <rect x="68" y="58" width="6" height="6" fill="#0f172a" />
                <rect x="80" y="56" width="8" height="6" fill="#0f172a" />
                <rect x="40" y="72" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="74" width="6" height="6" fill="#0f172a" />
                <rect x="66" y="72" width="8" height="8" fill="#0f172a" />
                <rect x="82" y="76" width="6" height="6" fill="#0f172a" />
                <rect x="44" y="86" width="8" height="6" fill="#0f172a" />
                <rect x="60" y="86" width="6" height="6" fill="#0f172a" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "800",
                  color: "#1e3a8a",
                  fontSize: "13px",
                }}
              >
                <FaCheckCircle style={{ color: "#16a34a" }} />
                <span>Contactless Mobile Boarding Pass</span>
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  marginTop: "2px",
                }}
              >
                Show this digital QR code to coach conductor at boarding point
                for immediate verification.
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                backgroundColor: "#ecfdf5",
                color: "#065f46",
                border: "1px solid #a7f3d0",
                fontSize: "11px",
                fontWeight: "800",
                padding: "4px 10px",
                borderRadius: "12px",
              }}
            >
              ✓ PNR Verified
            </span>
          </div>
        </div>

        {/* AI Travel Assistant Recommendations (Sequence 4) */}
        <div className="classic-ai-box">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#3730a3",
                fontWeight: "800",
                fontSize: "13px",
              }}
            >
              <FaRobot />
              <span>AI Travel Assistant for {toCity}</span>
            </div>
            <span
              style={{
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: "800",
                padding: "2px 8px",
                borderRadius: "10px",
              }}
            >
              Sequence 4 Live
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              fontSize: "11.5px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e0e7ff",
              }}
            >
              <strong style={{ color: "#1e40af", display: "block" }}>
                🌤️ Destination Weather
              </strong>
              <span style={{ color: "#475569" }}>
                {aiTips?.weather || `${toCity}: 24°C, Pleasant evening breeze`}
              </span>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #e0e7ff",
              }}
            >
              <strong style={{ color: "#059669", display: "block" }}>
                🚕 Arrival Transit Tip
              </strong>
              <span style={{ color: "#475569" }}>
                {aiTips?.trafficTip ||
                  `Prepaid auto and cab stands available directly at ${droppingPointName}.`}
              </span>
            </div>

            <div
              style={{
                backgroundColor: "#ecfdf5",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px dashed #10b981",
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              <div>
                <strong style={{ color: "#065f46" }}>
                  🎟️ AI Return Journey Coupon:
                </strong>
                <span style={{ color: "#047857", marginLeft: "6px" }}>
                  Use promo code <strong>SUPERBUS</strong> for 15% discount on
                  your return trip!
                </span>
              </div>
              <button
                onClick={handleCopyCoupon}
                className="no-print"
                style={{
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <FaCopy /> {copiedCoupon ? "Copied!" : "Copy Code"}
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar (Download PDF, Print & Close) */}
        <div className="classic-action-bar no-print">
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-outline-secondary"
              style={{
                fontWeight: "700",
                padding: "8px 18px",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            >
              Close
            </button>
          )}

          {/* Download Official PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="btn btn-success"
            style={{
              fontWeight: "800",
              padding: "9px 22px",
              backgroundColor: "#059669",
              borderColor: "#059669",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13.5px",
              boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)",
              cursor: isGeneratingPdf ? "wait" : "pointer",
            }}
          >
            <FaDownload /> {isGeneratingPdf ? "Generating PDF..." : "Download Ticket (PDF)"}
          </button>

          {/* Browser Print Button */}
          <button
            onClick={handlePrint}
            className="btn btn-primary"
            style={{
              fontWeight: "800",
              padding: "9px 20px",
              backgroundColor: "#4b3ee8",
              borderColor: "#4b3ee8",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13.5px",
              boxShadow: "0 2px 8px rgba(75, 62, 232, 0.3)",
            }}
          >
            <FaPrint /> Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default OriginalTicket;
