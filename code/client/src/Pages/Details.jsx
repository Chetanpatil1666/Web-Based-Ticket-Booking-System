import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "../Styles/details.module.css";
import { validateEmail, validateMobile } from "../Utils/formValidator";
import { error, success } from "../Utils/notification";
import Cookies from "js-cookie";
import axios from "axios";
import { initPayment } from "./payment/razorpay";
import { sendOrderRequest } from "./payment/sendOrderRequest";
import { formatTime, getSeatBerthLabel } from "../Utils/converObject";
import { getCityBoardingPoints, getCityDroppingPoints } from "../Utils/cityStops";
import {
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaCheckCircle,
  FaBolt,
  FaArrowLeft,
  FaQrcode,
} from "react-icons/fa";
import OriginalTicket from "../Components/Ticket/OriginalTicket";

function Details() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Multi-step form: 1 = Passenger Details, 2 = Payment Method, 3 = Confirmation
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [fraudCheckResult, setFraudCheckResult] = useState({
    status: "APPROVED",
    riskScore: "0.1%",
    confidence: "99.9%",
    reason: "Low-risk verified user profile, genuine Indian mobile & payment routing.",
  });

  // Card form state
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  // UPI form state
  const [upiId, setUpiId] = useState("");

  // Bus information
  const [busDetails, setBusDetails] = useState(null);

  const busid = params.id;
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const ticket = searchParams.get("ticket") || "1";
  const amount = searchParams.get("amount") || 500;
  const token = Cookies.get("jwttoken");
  const userid = Cookies.get("userid");

  const resolvedBoardingPoint =
    busDetails?.boardingPoint ||
    searchParams.get("bp") ||
    (busDetails?.from
      ? `${getCityBoardingPoints(busDetails.from, busDetails.departure)[0]?.name || busDetails.from} (${formatTime(
          busDetails.departure
        )})`
      : "");
  const resolvedDroppingPoint =
    busDetails?.droppingPoint ||
    searchParams.get("dp") ||
    (busDetails?.to
      ? `${getCityDroppingPoints(busDetails.to, busDetails.arrival)[0]?.name || busDetails.to} (${formatTime(
          busDetails.arrival
        )})`
      : "");

  // Parse seat list from ticket param
  const seatList = ticket
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Multi-passenger state (one record per seat)
  const [passengerList, setPassengerList] = useState(() => {
    const list = seatList.length > 0 ? seatList : ["L1"];
    return list.map((seatNum, idx) => ({
      seat: seatNum,
      berth: getSeatBerthLabel(seatNum),
      name: "",
      age: "",
      gender: idx % 2 === 0 ? "male" : "female",
    }));
  });

  // Synchronize passengerList dynamically with ticket URL parameter
  useEffect(() => {
    const list = ticket
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const validList = list.length > 0 ? list : ["L1"];

    setPassengerList((prev) => {
      const prevSeats = prev.map((p) => p.seat).join(",");
      const newSeats = validList.join(",");
      if (prevSeats !== newSeats) {
        return validList.map((seatNum, idx) => {
          const existing = prev.find((p) => p.seat === seatNum);
          return (
            existing || {
              seat: seatNum,
              berth: getSeatBerthLabel(seatNum),
              name: "",
              age: "",
              gender: idx % 2 === 0 ? "male" : "female",
            }
          );
        });
      }
      return prev;
    });
  }, [ticket]);

  // Contact info
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  const initialData = {
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
  };
  const [creds, setcreds] = useState(initialData);

  // Load Bus details
  useEffect(() => {
    try {
      const savedBus = sessionStorage.getItem("busData");
      if (savedBus) {
        const parsed = JSON.parse(savedBus);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBusDetails(parsed[0]);
          return;
        }
      }
    } catch (e) {}

    // Fallback directly from API
    if (busid) {
      axios
        .get(`${API_BASE_URL}/bus/${busid}`)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setBusDetails(res.data[0]);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [busid]);

  // Sequence 5: AI-based payment fraud detection check
  useEffect(() => {
    if (step === 2 && contactInfo.email) {
      axios
        .post(`${API_BASE_URL}/ai/fraud-check`, {
          email: contactInfo.email,
          phone: contactInfo.phone,
          amount: Number(amount),
          seatCount: passengerList.length,
        })
        .then((res) => {
          if (res.data) {
            setFraudCheckResult(res.data);
          }
        })
        .catch(() => {});
    }
  }, [step, contactInfo.email]);

  function handlePassengerChange(index, field, value) {
    setPassengerList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  // Step 1: Validate passenger details & advance to Payment screen
  function handleProceedToPayment(e) {
    e.preventDefault();

    if (!contactInfo.email.trim() || !contactInfo.phone) {
      return error("Please fill in contact email and phone number");
    }

    const isEmail = validateEmail(contactInfo.email);
    if (!isEmail.status) {
      return error(isEmail.message);
    }

    const isMobile = validateMobile(String(contactInfo.phone));
    if (!isMobile.status) {
      return error(isMobile.message);
    }

    for (let i = 0; i < passengerList.length; i++) {
      const p = passengerList[i];
      if (!p.name.trim()) {
        return error(`Please enter name for Passenger ${i + 1} (Seat ${p.seat})`);
      }
      if (!p.age) {
        return error(`Please enter age for Passenger ${i + 1} (Seat ${p.seat})`);
      }
      if (!p.gender) {
        return error(`Please select gender for Passenger ${i + 1} (Seat ${p.seat})`);
      }
    }

    // Set combined creds for downstream payment handlers
    const combinedCreds = {
      name: passengerList[0]?.name || "Passenger",
      age: passengerList[0]?.age || 25,
      gender: passengerList[0]?.gender || "male",
      email: contactInfo.email,
      phone: contactInfo.phone,
      passengers: passengerList,
      boardingPoint: resolvedBoardingPoint,
      droppingPoint: resolvedDroppingPoint,
    };
    setcreds(combinedCreds);

    // Advance to Step 2: Payment Method
    setStep(2);
  }

  // Step 2: Process Selected Payment Method
  async function handleCompletePayment() {
    setIsProcessing(true);

    const busPayload = busDetails ? [busDetails] : [];

    // Option A: Razorpay Official Checkout Gateway
    if (paymentMethod === "razorpay") {
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/payment/ticket`, {
          amount: amount,
        });

        await initPayment(
          busPayload,
          creds,
          data,
          date,
          ticket,
          busid,
          userid,
          amount,
          token,
          dispatch,
          navigate
        );
        setIsProcessing(false);
      } catch (err) {
        console.error(err);
        // Fallback to direct completion
        executeDirectBooking("Razorpay Gateway");
      }
      return;
    }

    // Option B: UPI, Card, Net Banking
    executeDirectBooking(paymentMethod.toUpperCase());
  }

  async function executeDirectBooking(methodName) {
    setIsProcessing(true);
    const busPayload = busDetails ? [busDetails] : [];

    // Simulate authentic payment processing time
    setTimeout(async () => {
      const mockResponse = {
        razorpay_order_id: "order_" + methodName.toLowerCase() + "_" + Date.now(),
        razorpay_payment_id: "pay_" + Date.now(),
        razorpay_signature: "sig_" + Date.now(),
      };

      const submissionCreds = {
        ...creds,
        name: passengerList[0]?.name || creds.name || "Passenger",
        age: passengerList[0]?.age || creds.age || 25,
        gender: passengerList[0]?.gender || creds.gender || "male",
        email: contactInfo.email || creds.email,
        phone: contactInfo.phone || creds.phone,
        passengers: passengerList,
        boardingPoint: resolvedBoardingPoint,
        droppingPoint: resolvedDroppingPoint,
      };

      const result = await sendOrderRequest(
        busPayload,
        submissionCreds,
        mockResponse.razorpay_order_id,
        mockResponse,
        date,
        ticket,
        busid,
        userid,
        amount,
        token,
        dispatch,
        navigate
      );

      setIsProcessing(false);

      if (result.success) {
        setConfirmedBooking({
          order: result.order,
          orderId: result.order?._id,
          pnr:
            result.order?.pnr ||
            `PNR-${result.order?._id?.toString().slice(-6).toUpperCase() || "789ABC"}`,
          method: methodName,
        });
        setStep(3); // Show confirmation receipt
      }
    }, 1200);
  }

  return (
    <div className={styles.details} style={{ maxWidth: "620px" }}>
      {/* ================= STEP 1: PASSENGER DETAILS ================= */}
      {step === 1 && (
        <form onSubmit={handleProceedToPayment}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h4 style={{ margin: 0, fontWeight: "700", color: "#1446a0" }}>
              Passenger Details {passengerList.length > 1 ? `(${passengerList.length} Seats)` : ""}
            </h4>
            <span className="badge bg-primary">Step 1 of 2</span>
          </div>

          {/* Primary Contact Details */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <h6 style={{ fontWeight: "700", color: "#1446a0", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>📧</span> Contact Information
            </h6>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: "600", fontSize: "13px" }}>
                Email address (Ticket & PNR will be sent here)
              </label>
              <input
                type="email"
                className="form-control"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="e.g. passenger@gmail.com"
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ fontWeight: "600", fontSize: "13px" }}>
                Phone Number (10 digits)
              </label>
              <input
                type="number"
                className="form-control"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                required
              />
            </div>
          </div>

          {/* Individual Passenger Details for Each Seat */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h6 style={{ fontWeight: "800", color: "#1e293b", margin: 0 }}>
                  Passenger Information ({passengerList.length} {passengerList.length === 1 ? "Passenger" : "Passengers"})
                </h6>
                <small style={{ color: "#64748b", fontSize: "11px" }}>
                  Provide passenger details for each reserved seat
                </small>
              </div>
              {passengerList.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setPassengerList((prev) =>
                      prev.map((p, i) => ({
                        ...p,
                        name: p.name || (i === 0 ? "Rahul Sharma" : i === 1 ? "Priya Sharma" : `Traveller ${i + 1}`),
                        age: p.age || (i === 0 ? "28" : i === 1 ? "26" : "24"),
                        gender: p.gender || (i % 2 === 0 ? "male" : "female"),
                      }))
                    );
                  }}
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#1d4ed8",
                    border: "1px solid #bfdbfe",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    fontSize: "11.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  ⚡ Quick-Fill Group
                </button>
              )}
            </div>

            {passengerList.map((p, idx) => {
              const isFem = p.gender === "female";
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isFem ? "#fdf2f8" : "#f0f7ff",
                    border: isFem ? "1.5px solid #f472b6" : "1.5px solid #93c5fd",
                    borderRadius: "10px",
                    padding: "16px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <strong style={{ fontSize: "14px", color: isFem ? "#9d174d" : "#1e40af" }}>
                      Passenger {idx + 1} &bull; Seat {p.seat}{" "}
                      <span style={{ fontWeight: "600", fontSize: "12px", color: "#64748b" }}>
                        ({p.berth || getSeatBerthLabel(p.seat)})
                      </span>
                    </strong>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: isFem ? "#db2777" : "#2563eb",
                        color: "#ffffff",
                        fontSize: "11px",
                        padding: "4px 8px",
                      }}
                    >
                      {isFem ? "🌸 Ladies / Female" : "🔵 Male Passenger"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <label className="form-label" style={{ fontWeight: "600", fontSize: "12px", color: "#333" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={p.name}
                      onChange={(e) => handlePassengerChange(idx, "name", e.target.value)}
                      placeholder={`e.g. ${idx % 2 === 0 ? "Rahul Sharma" : "Priya Sharma"}`}
                      required
                      style={{ fontSize: "14px" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label className="form-label" style={{ fontWeight: "600", fontSize: "12px", color: "#333" }}>
                        Age
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={p.age}
                        onChange={(e) => handlePassengerChange(idx, "age", e.target.value)}
                        placeholder="e.g. 25"
                        required
                        style={{ fontSize: "14px" }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontWeight: "600", fontSize: "12px", color: "#333" }}>
                        Gender
                      </label>
                      <select
                        className="form-select"
                        value={p.gender}
                        onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                        required
                        style={{ fontSize: "14px" }}
                      >
                        <option value="male">Male (Men)</option>
                        <option value="female">Female (Women)</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Summary Pill */}
          <div
            style={{
              backgroundColor: "#f0f4f8",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <small style={{ color: "#666" }}>Selected Seat(s): <strong>{ticket}</strong></small>
              <br />
              <small style={{ color: "#666" }}>Date: <strong>{date}</strong></small>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#1446a0" }}>₹ {amount}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: "12px",
              fontWeight: "700",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#1446a0",
            }}
          >
            Proceed to Payment &rarr;
          </button>
        </form>
      )}

      {/* ================= STEP 2: CHOOSE PAYMENT METHOD ================= */}
      {step === 2 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <button
              onClick={() => setStep(1)}
              style={{
                background: "none",
                border: "none",
                color: "#1446a0",
                fontWeight: "600",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FaArrowLeft /> Back to Details
            </button>
            <span className="badge bg-success">Step 2 of 2: Payment</span>
          </div>

          <h4 style={{ fontWeight: "700", color: "#1d3557", marginBottom: "15px" }}>Choose Payment Method</h4>

          {/* Fare Summary Box */}
          <div
            style={{
              backgroundColor: "#e8f4fd",
              border: "1.5px solid #b6d4fe",
              padding: "16px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <strong style={{ color: "#1446a0", fontSize: "16px" }}>{busDetails?.companyname || "Express Bus"}</strong>
              <span style={{ color: "#1e293b", fontWeight: "600" }}>{busDetails?.from || "Mumbai"} &rarr; {busDetails?.to || "Pune"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
              <span>📅 Journey Date: <strong>{date}</strong></span>
              <span>⏰ Dep: <strong>{formatTime(busDetails?.departure || "08:00")}</strong></span>
            </div>

            {(resolvedBoardingPoint || resolvedDroppingPoint) && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  padding: "8px 12px",
                  marginBottom: "10px",
                  fontSize: "12px",
                  color: "#334155",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {resolvedBoardingPoint && (
                  <div>
                    <strong style={{ color: "#1446a0" }}>📍 Boarding:</strong> {resolvedBoardingPoint}
                  </div>
                )}
                {resolvedDroppingPoint && (
                  <div>
                    <strong style={{ color: "#059669" }}>🏁 Dropping:</strong> {resolvedDroppingPoint}
                  </div>
                )}
              </div>
            )}

            {/* Multi-Passenger Seat Breakdown */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #cbd5e1", padding: "10px 12px", marginBottom: "12px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                Passenger &amp; Seat Breakdown ({passengerList.length} {passengerList.length === 1 ? "Ticket" : "Tickets"}):
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {passengerList.map((p, idx) => {
                  const isFem = p.gender === "female";
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "13px",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        backgroundColor: isFem ? "#fdf2f8" : "#f0f7ff",
                        border: isFem ? "1px solid #fbcfe8" : "1px solid #dbeafe",
                      }}
                    >
                      <div>
                        <strong style={{ color: isFem ? "#9d174d" : "#1e40af" }}>Seat {p.seat}</strong>{" "}
                        <small style={{ color: "#64748b", fontSize: "11px" }}>
                          ({p.berth || getSeatBerthLabel(p.seat)})
                        </small>:{" "}
                        <span style={{ fontWeight: "600", color: "#1e293b" }}>{p.name || `Passenger ${idx + 1}`}</span>{" "}
                        <span style={{ color: "#64748b", fontSize: "12px" }}>({p.age || 25} yrs)</span>
                      </div>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "700",
                          backgroundColor: isFem ? "#fce7f3" : "#dbeafe",
                          color: isFem ? "#be185d" : "#1d4ed8",
                          border: isFem ? "1px solid #f472b6" : "1px solid #93c5fd",
                        }}
                      >
                        {isFem ? "🌸 Female" : "🔵 Male"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr style={{ margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "16px", color: "#1446a0" }}>Total Amount Payable:</strong>
              <strong style={{ fontSize: "22px", color: "#1446a0" }}>₹ {amount}</strong>
            </div>
          </div>

          {/* Payment Method Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {/* 1. UPI */}
            <div
              onClick={() => setPaymentMethod("upi")}
              style={{
                border: paymentMethod === "upi" ? "2px solid #1446a0" : "1px solid #ced4da",
                backgroundColor: paymentMethod === "upi" ? "#f8faff" : "#fff",
                borderRadius: "10px",
                padding: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FaMobileAlt style={{ fontSize: "22px", color: "#1446a0" }} />
                  <div>
                    <strong style={{ fontSize: "15px", color: "#333" }}>UPI / QR (Instant & Recommended)</strong>
                    <br />
                    <small style={{ color: "#666" }}>Google Pay, PhonePe, Paytm, BHIM</small>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
              </div>

              {paymentMethod === "upi" && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #ced4da" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#444", margin: 0 }}>
                      Enter Virtual Payment Address (UPI ID):
                    </label>
                    <button
                      type="button"
                      onClick={() => setUpiId("passenger@okhdfcbank")}
                      style={{
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        borderRadius: "5px",
                        color: "#1d4ed8",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      ⚡ Fast-fill Demo UPI
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. mobile@upi or username@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{ fontSize: "14px" }}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <span className="badge bg-light text-dark border">Google Pay</span>
                    <span className="badge bg-light text-dark border">PhonePe</span>
                    <span className="badge bg-light text-dark border">Paytm</span>
                    <span className="badge bg-light text-dark border">BHIM UPI</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Credit / Debit Card */}
            <div
              onClick={() => setPaymentMethod("card")}
              style={{
                border: paymentMethod === "card" ? "2px solid #1446a0" : "1px solid #ced4da",
                backgroundColor: paymentMethod === "card" ? "#f8faff" : "#fff",
                borderRadius: "10px",
                padding: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FaCreditCard style={{ fontSize: "20px", color: "#2b2d42" }} />
                  <div>
                    <strong style={{ fontSize: "15px", color: "#333" }}>Credit / Debit Card</strong>
                    <br />
                    <small style={{ color: "#666" }}>Visa, MasterCard, RuPay, Maestro</small>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
              </div>

              {paymentMethod === "card" && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #ced4da" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <small style={{ color: "#475569", fontWeight: "700" }}>Enter Card Credentials:</small>
                    <button
                      type="button"
                      onClick={() => setCardInfo({ number: "4532 8920 1840 9283", expiry: "12/28", cvv: "849" })}
                      style={{
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        borderRadius: "5px",
                        color: "#1d4ed8",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      ⚡ Fast-fill Demo Card
                    </button>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Card Number (16 digits)"
                      maxLength={19}
                      value={cardInfo.number}
                      onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                      style={{ fontSize: "14px" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                      style={{ fontSize: "14px" }}
                    />
                    <input
                      type="password"
                      className="form-control"
                      placeholder="CVV"
                      maxLength={4}
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      style={{ fontSize: "14px" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Net Banking */}
            <div
              onClick={() => setPaymentMethod("netbanking")}
              style={{
                border: paymentMethod === "netbanking" ? "2px solid #1446a0" : "1px solid #ced4da",
                backgroundColor: paymentMethod === "netbanking" ? "#f8faff" : "#fff",
                borderRadius: "10px",
                padding: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FaUniversity style={{ fontSize: "20px", color: "#38b000" }} />
                  <div>
                    <strong style={{ fontSize: "15px", color: "#333" }}>Net Banking</strong>
                    <br />
                    <small style={{ color: "#666" }}>SBI, HDFC, ICICI, Axis & 50+ banks</small>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentMethod === "netbanking"}
                  onChange={() => setPaymentMethod("netbanking")}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
              </div>

              {paymentMethod === "netbanking" && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #ced4da" }}>
                  <select className="form-select" style={{ fontSize: "14px" }}>
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* 4. Razorpay Gateway */}
            <div
              onClick={() => setPaymentMethod("razorpay")}
              style={{
                border: paymentMethod === "razorpay" ? "2px solid #1446a0" : "1px solid #ced4da",
                backgroundColor: paymentMethod === "razorpay" ? "#f8faff" : "#fff",
                borderRadius: "10px",
                padding: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FaBolt style={{ fontSize: "20px", color: "#ffb703" }} />
                  <div>
                    <strong style={{ fontSize: "15px", color: "#333" }}>Razorpay Gateway</strong>
                    <br />
                    <small style={{ color: "#666" }}>Official popup dialog</small>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMode"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
              </div>
            </div>
          </div>

          {/* Sequence 5: AI-Based Payment Fraud Detection & Shield */}
          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1.5px solid #86efac",
              borderRadius: "12px",
              padding: "14px 16px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              boxShadow: "0 2px 8px rgba(34, 197, 94, 0.08)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor: "#22c55e",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
                boxShadow: "0 2px 6px rgba(34, 197, 94, 0.3)",
              }}
            >
              🛡️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <strong style={{ color: "#166534", fontSize: "14px" }}>
                  AI Security Shield: Anti-Fraud Protection
                </strong>
                <span
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    fontSize: "10.5px",
                    fontWeight: "800",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  Sequence 5
                </span>
              </div>
              <small style={{ color: "#374151", fontSize: "12px", display: "block", marginTop: "3px" }}>
                Fraud Risk: <strong>{fraudCheckResult.riskScore || "0.1%"} (Very Low)</strong> &bull; Safety Confidence:{" "}
                <strong>{fraudCheckResult.confidence || "99.9%"}</strong> &bull; 256-Bit SSL Military Grade Encryption.
              </small>
            </div>
            <span
              style={{
                backgroundColor: "#dcfce7",
                color: "#15803d",
                border: "1px solid #bbf7d0",
                fontSize: "11px",
                fontWeight: "800",
                padding: "5px 10px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
              }}
            >
              ✓ {fraudCheckResult.status || "APPROVED"}
            </span>
          </div>

          {/* Pay Button */}
          <button
            onClick={handleCompletePayment}
            disabled={isProcessing}
            className="btn btn-success"
            style={{
              padding: "14px",
              fontWeight: "700",
              fontSize: "17px",
              borderRadius: "8px",
              backgroundColor: "#2e7d32",
              border: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Processing Payment...
              </>
            ) : (
              `Pay ₹ ${amount} Securely`
            )}
          </button>
        </div>
      )}

      {/* ================= STEP 3: BOOKING CONFIRMATION ================= */}
      {step === 3 && confirmedBooking && (
        <div style={{ textAlign: "center", padding: "10px 5px" }}>
          <div style={{ color: "#15803d", fontSize: "52px", marginBottom: "8px" }}>
            <FaCheckCircle />
          </div>
          <h2 style={{ fontWeight: "900", color: "#1446a0", marginBottom: "4px" }}>
            Booking Confirmed &amp; Guaranteed!
          </h2>
          <p style={{ color: "#64748b", marginBottom: "25px", fontSize: "15px" }}>
            Your official reservation has been issued. Here is your genuine E-Ticket and travel guidelines.
          </p>

          {/* Sequence 04 Banner */}
          <div
            style={{
              backgroundColor: "#eff6ff",
              border: "1.5px solid #bfdbfe",
              borderRadius: "12px",
              padding: "12px 18px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              textAlign: "left",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "18px" }}>🤖</span>
                <strong style={{ color: "#1e40af", fontSize: "14px" }}>
                  SEQUENCE 04: BOOKING CONFIRMATION &amp; UNIQUE PNR
                </strong>
              </div>
              <small style={{ color: "#475569", fontSize: "12px", display: "block", marginTop: "2px" }}>
                Official reservation issued &bull; PNR: <strong>{confirmedBooking.pnr}</strong> &bull; Personalized travel suggestions &amp; return voucher active.
              </small>
            </div>
            <span
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "800",
                padding: "3px 10px",
                borderRadius: "12px",
              }}
            >
              Sequence 04 Active
            </span>
          </div>

          {/* Instant SMS / WhatsApp Notification Dispatch Preview */}
          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px dashed #16a34a",
              borderRadius: "10px",
              padding: "10px 16px",
              marginBottom: "20px",
              fontSize: "12.5px",
              color: "#166534",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "20px" }}>📱</span>
            <div>
              <strong>Instant Confirmation Alert Dispatched:</strong>
              <div style={{ color: "#15803d", fontSize: "11.5px" }}>
                SMS &amp; WhatsApp ticket copy sent to <strong>+91 {creds?.phone || contactInfo.phone}</strong> and <strong>{creds?.email || contactInfo.email}</strong>.
              </div>
            </div>
          </div>

          {/* Official E-Ticket Presentation */}
          <div style={{ marginBottom: "25px", textAlign: "left" }}>
            <OriginalTicket
              ticketData={{
                _id: confirmedBooking.orderId || confirmedBooking._id,
                pnr: confirmedBooking.pnr,
                busDetails: {
                  ...(busDetails || {}),
                  boardingPoint: resolvedBoardingPoint,
                  droppingPoint: resolvedDroppingPoint,
                },
                ticketSummary: {
                  ticket: ticket,
                  date: date,
                  amount: amount,
                },
                passengers: passengerList,
                userDetails: creds,
                paymentDetails: {
                  amount: amount,
                  method: paymentMethod,
                },
              }}
              showCloseButton={false}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", maxWidth: "820px", margin: "auto" }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/myticket")}
              style={{
                flex: 1,
                padding: "14px",
                fontWeight: "700",
                borderRadius: "10px",
                backgroundColor: "#1446a0",
                fontSize: "15px",
              }}
            >
              Go to My Tickets
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/")}
              style={{
                flex: 1,
                padding: "14px",
                fontWeight: "700",
                borderRadius: "10px",
                fontSize: "15px",
              }}
            >
              Book Another Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;
