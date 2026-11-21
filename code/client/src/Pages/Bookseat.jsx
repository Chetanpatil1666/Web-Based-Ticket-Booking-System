import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { useSelector, useDispatch } from "react-redux";
import EachDeckSeat from "../Components/Seats/EachDeckSeat";
import styles from "../Styles/bookseat.module.css";
import axios from "axios";
import { BiArrowFromLeft } from "react-icons/bi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { error } from "../Utils/notification";
import { removeData, removeall } from "../Redux/ticket/ticket.action";
import {
  formatTime,
  isSleeperBus,
  normalizeSleeperSeatId,
  getSeatBerthLabel,
} from "../Utils/converObject";
import { getCityBoardingPoints, getCityDroppingPoints } from "../Utils/cityStops";
import { GiSteeringWheel } from "react-icons/gi";
import { FaCheck, FaTimes, FaBus, FaCalendarAlt, FaMale, FaFemale, FaMapMarkerAlt } from "react-icons/fa";

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

// Original Indian 2+1 Sleeper Coach numbering (Front-to-Rear columns)
const LOWER_SINGLE = ["L1", "L4", "L7", "L10", "L13"];
const LOWER_DOUBLE_AISLE = ["L2", "L5", "L8", "L11", "L14"];
const LOWER_DOUBLE_WINDOW = ["L3", "L6", "L9", "L12", "L15"];

const UPPER_SINGLE = ["U1", "U4", "U7", "U10", "U13"];
const UPPER_DOUBLE_AISLE = ["U2", "U5", "U8", "U11", "U14"];
const UPPER_DOUBLE_WINDOW = ["U3", "U6", "U9", "U12", "U15"];

// Original Indian 2+2 Pushback Seater Coach numbering (1 to 40, Front-to-Rear)
const SEATER_WINDOW_TOP = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37];
const SEATER_AISLE_TOP = [2, 6, 10, 14, 18, 22, 26, 30, 34, 38];
const SEATER_AISLE_BOTTOM = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39];
const SEATER_WINDOW_BOTTOM = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];

function Bookseat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setdata] = useState(() => {
    try {
      const cached = sessionStorage.getItem("busData");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0 && String(parsed[0]._id) === String(param.id)) {
          return parsed;
        }
      }
    } catch (e) {}
    return [];
  });
  const [bookedSeates, setbookedSeates] = useState([]);
  const [bookedSeatsGender, setBookedSeatsGender] = useState({});
  const [wentwrong, setwentwrong] = useState(false);
  const [boardingIdx, setBoardingIdx] = useState(0);
  const [droppingIdx, setDroppingIdx] = useState(0);

  const ticket = useSelector((state) => state.ticket?.ticketNo) || [];

  useEffect(() => {
    dispatch(removeall());
    let date = searchParams.get("date");
    if (!date || date === "null" || date === "undefined") {
      date = new Date().toISOString().split("T")[0];
      setSearchParams({ date });
    }
    getdata(date);
  }, [param.id]);

  async function getdata(dateVal) {
    try {
      let rawDate = dateVal || searchParams.get("date");
      let curDate =
        rawDate && rawDate !== "null" && rawDate !== "undefined"
          ? rawDate
          : new Date().toISOString().split("T")[0];
      let res = await axios.post(`${API_BASE_URL}/bus/one`, {
        id: param.id,
        date: curDate,
      });

      if (res.data && res.data.length > 0) {
        setdata(res.data);
        const busObj = res.data[0];
        const sleeperMode = isSleeperBus(busObj);
        const norm = (seatId) =>
          sleeperMode ? normalizeSleeperSeatId(seatId) : String(seatId).trim();

        const rawBooked = Array.isArray(busObj.bookedSeatsList)
          ? busObj.bookedSeatsList
          : [];
        const rawGenderMap = busObj.bookedSeatsGender || {};

        let booked = [];
        let genderMap = {};

        rawBooked.forEach((s) => {
          const id = norm(s);
          if (id && !booked.includes(id)) booked.push(id);
          if (rawGenderMap[s]) genderMap[id] = rawGenderMap[s];
        });

        // Fallback scan of legacy busObj.seats array
        let info = busObj.seats || [];
        info.forEach((ele) => {
          if (typeof ele === "string") {
            let x = ele.split("@");
            let sDate = (x[0] || "").split("T")[0];
            let cDate = curDate.split("T")[0];
            if (sDate === cDate && x[1]) {
              const rawGender = String(x[2] || "male").toLowerCase();
              const normGender =
                rawGender === "women" || rawGender === "female" || rawGender === "f"
                  ? "female"
                  : "male";

              let z = x[1].split(",");
              z.forEach((s) => {
                const id = norm(s);
                if (id) {
                  if (!booked.includes(id)) booked.push(id);
                  if (!genderMap[id]) genderMap[id] = normGender;
                }
              });
            }
          }
        });

        setbookedSeates(booked);
        setBookedSeatsGender(genderMap);
      }
      setwentwrong(false);
    } catch (err) {
      console.error("Error fetching bus seat data:", err);
      if (!data || data.length === 0) {
        setwentwrong(true);
      }
    }
  }

  const isBooked = (seatId) => {
    return bookedSeates.some((s) => String(s).trim() === String(seatId).trim());
  };

  const getSeatGender = (seatId) => {
    return bookedSeatsGender[String(seatId)] || "male";
  };

  const busInfo = data && data.length > 0 ? data[0] : null;
  const farePrice = busInfo?.price || 650;
  const journeyDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const sleeperCoach = isSleeperBus(busInfo);
  const totalCapacity = sleeperCoach ? 30 : 40;
  const seatVariant = sleeperCoach ? "sleeper" : "seater";

  const boardingStops = busInfo
    ? getCityBoardingPoints(busInfo.from, busInfo.departure)
    : [];
  const droppingStops = busInfo
    ? getCityDroppingPoints(busInfo.to, busInfo.arrival)
    : [];
  const selectedBoarding = boardingStops[boardingIdx] || boardingStops[0];
  const selectedDropping = droppingStops[droppingIdx] || droppingStops[0];

  function handleProceed(farePrice) {
    if (ticket.length > 0) {
      const updatedBusData =
        Array.isArray(data) && data.length > 0
          ? [
              {
                ...data[0],
                boardingPoint: selectedBoarding
                  ? `${selectedBoarding.name} (${selectedBoarding.time}) — ${selectedBoarding.landmark}`
                  : "",
                droppingPoint: selectedDropping
                  ? `${selectedDropping.name} (${selectedDropping.time}) — ${selectedDropping.landmark}`
                  : "",
              },
            ]
          : data;
      sessionStorage.setItem("busData", JSON.stringify(updatedBusData));
      let curDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
      navigate(
        `/details/${param.id}?date=${encodeURIComponent(curDate)}&ticket=${encodeURIComponent(
          ticket.join(",")
        )}&amount=${ticket.length * farePrice}&bp=${encodeURIComponent(
          selectedBoarding ? `${selectedBoarding.name} (${selectedBoarding.time})` : ""
        )}&dp=${encodeURIComponent(
          selectedDropping ? `${selectedDropping.name} (${selectedDropping.time})` : ""
        )}`
      );
    } else {
      error("Please select at least one seat to proceed");
    }
  }

  const renderSeatRow = (rowLabel, seatIds) => (
    <div className={styles.seatRowWrapper}>
      <span className={styles.rowTagLabel}>{rowLabel}</span>
      <div className={styles.seatRow}>
        {seatIds.map((seatId) => (
          <EachDeckSeat
            key={seatId}
            id={seatId}
            disable={isBooked(seatId)}
            bookedGender={getSeatGender(seatId)}
            fare={farePrice}
            variant={seatVariant}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {wentwrong ? (
        <div className={styles.wrong}>
          <img
            src={require("../Images/404-error-page-templates.png")}
            alt="Error loading bus"
          />
          <h3>Oops! Unable to load seat layout.</h3>
          <button className="btn btn-primary mt-3" onClick={() => getdata()}>
            Retry
          </button>
        </div>
      ) : (
        <div className={styles.main}>
          {/* LEFT COLUMN: SEATS & DECKS */}
          <div className={styles.seats}>
            {/* Sequence 03: AI Live Seat Availability & Berth Recommendation Banner */}
            <div
              style={{
                backgroundColor: "#eff6ff",
                border: "1.5px solid #bfdbfe",
                borderRadius: "14px",
                padding: "14px 18px",
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>🤖</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <strong style={{ color: "#1e3a8a", fontSize: "14px" }}>
                      {sleeperCoach
                        ? "2+1 Sleeper Coach (Original L1-L15 & U1-U15)"
                        : "2+2 Pushback Seater Coach (Seats 1-40)"}
                    </strong>
                    <span
                      style={{
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "2px 7px",
                        borderRadius: "8px",
                      }}
                    >
                      Sequence 03
                    </span>
                  </div>
                  <small style={{ color: "#475569", fontSize: "12px", display: "block", marginTop: "2px" }}>
                    💡 <strong>AI Tip:</strong>{" "}
                    {sleeperCoach
                      ? "Lower Deck Single Berths (L1, L4, L7, L10) offer lowest vibration & maximum solo privacy."
                      : "Front Window Seats (1, 4, 5, 8, 9, 12) offer smooth front suspension & scenic highway views."}
                  </small>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span
                  style={{
                    backgroundColor: "#ecfdf5",
                    color: "#065f46",
                    border: "1px solid #a7f3d0",
                    fontSize: "12px",
                    fontWeight: "800",
                    padding: "5px 12px",
                    borderRadius: "20px",
                  }}
                >
                  🟢 {Math.max(totalCapacity - bookedSeates.length, 0)} of {totalCapacity}{" "}
                  {sleeperCoach ? "Berths" : "Seats"} Available
                </span>
              </div>
            </div>

            {/* Visual Seat Legend */}
            <div className={styles.legendCard}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendSample} ${styles.legendSampleAvailable}`}>
                  <div className={styles.legendSamplePillow} />
                  <span>{sleeperCoach ? "L1" : "1"}</span>
                </div>
                <div className={styles.legendText}>
                  <span className={styles.legendTitle}>Available</span>
                  <span className={styles.legendSubtitle}>Click to select</span>
                </div>
              </div>

              <div className={styles.legendItem}>
                <div className={`${styles.legendSample} ${styles.legendSampleSelected}`}>
                  <div className={styles.legendSamplePillow} />
                  <FaCheck style={{ fontSize: "9px" }} />
                </div>
                <div className={styles.legendText}>
                  <span className={styles.legendTitle}>Selected</span>
                  <span className={styles.legendSubtitle}>In your booking</span>
                </div>
              </div>

              <div className={styles.legendItem}>
                <div className={`${styles.legendSample} ${styles.legendSampleBookedMale}`}>
                  <div className={styles.legendSamplePillow} />
                  <FaMale style={{ fontSize: "12px", color: "#2563eb" }} />
                </div>
                <div className={styles.legendText}>
                  <span className={styles.legendTitle} style={{ color: "#1e3a8a" }}>
                    Male Booked
                  </span>
                  <span className={styles.legendSubtitle}>Booked by male</span>
                </div>
              </div>

              <div className={styles.legendItem}>
                <div className={`${styles.legendSample} ${styles.legendSampleBookedFemale}`}>
                  <div className={styles.legendSamplePillow} />
                  <FaFemale style={{ fontSize: "12px", color: "#db2777" }} />
                </div>
                <div className={styles.legendText}>
                  <span className={styles.legendTitle} style={{ color: "#db2777" }}>
                    Female Booked
                  </span>
                  <span className={styles.legendSubtitle}>Ladies reserved</span>
                </div>
              </div>
            </div>

            {sleeperCoach ? (
              <>
                {/* LOWER DECK (L1 - L15) */}
                <div className={styles.deckSection}>
                  <div className={styles.deckHeader}>
                    <div className={styles.deckBadgeTitle}>
                      <span className={styles.deckBadge}>Lower Deck (L1 - L15)</span>
                      <span className={styles.deckSubtitle}>15 Sleeper Berths (2+1)</span>
                    </div>
                    <div className={styles.driverCabin} title="Front of Bus - Driver Cabin">
                      <GiSteeringWheel style={{ fontSize: "20px", color: "#475569" }} />
                      <span>Front &rarr; Rear</span>
                    </div>
                  </div>

                  <div className={styles.busInterior}>
                    <div className={styles.frontCabinSide} title="Driver Cabin (Front)">
                      <GiSteeringWheel style={{ fontSize: "24px", color: "#1446a0" }} />
                      <span>Driver</span>
                      <span style={{ fontSize: "9px", color: "#94a3b8", marginTop: "auto" }}>
                        Front
                      </span>
                    </div>

                    <div className={styles.seatDeckRows}>
                      {renderSeatRow("Single (1)", LOWER_SINGLE)}

                      <div className={styles.aisleWalkway}>
                        <span className={styles.aisleText}>&larr; Walkway / Aisle &rarr;</span>
                      </div>

                      <div className={styles.doubleRowGroup}>
                        {renderSeatRow("Dbl Aisle", LOWER_DOUBLE_AISLE)}
                        {renderSeatRow("Dbl Window", LOWER_DOUBLE_WINDOW)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* UPPER DECK (U1 - U15) */}
                <div className={styles.deckSection}>
                  <div className={styles.deckHeader}>
                    <div className={styles.deckBadgeTitle}>
                      <span className={styles.deckBadge} style={{ backgroundColor: "#0284c7" }}>
                        Upper Deck (U1 - U15)
                      </span>
                      <span className={styles.deckSubtitle}>15 Sleeper Berths (2+1)</span>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b" }}>
                      Upper Tier Ladder at Front
                    </span>
                  </div>

                  <div className={styles.busInterior}>
                    <div className={styles.frontCabinSide} title="Upper Tier Access">
                      <span style={{ fontSize: "16px" }}>🪜</span>
                      <span>Stairs</span>
                      <span style={{ fontSize: "9px", color: "#94a3b8", marginTop: "auto" }}>
                        Front
                      </span>
                    </div>

                    <div className={styles.seatDeckRows}>
                      {renderSeatRow("Single (1)", UPPER_SINGLE)}

                      <div className={styles.aisleWalkway}>
                        <span className={styles.aisleText}>&larr; Walkway / Aisle &rarr;</span>
                      </div>

                      <div className={styles.doubleRowGroup}>
                        {renderSeatRow("Dbl Aisle", UPPER_DOUBLE_AISLE)}
                        {renderSeatRow("Dbl Window", UPPER_DOUBLE_WINDOW)}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* SEATER DECK (1 - 40, 2+2 Pushback Coach) */
              <div className={styles.deckSection}>
                <div className={styles.deckHeader}>
                  <div className={styles.deckBadgeTitle}>
                    <span className={styles.deckBadge} style={{ backgroundColor: "#059669" }}>
                      Seater Coach (1 - 40)
                    </span>
                    <span className={styles.deckSubtitle}>40 Pushback Seats (2+2)</span>
                  </div>
                  <div className={styles.driverCabin} title="Front of Bus - Driver Cabin">
                    <GiSteeringWheel style={{ fontSize: "20px", color: "#475569" }} />
                    <span>Front &rarr; Rear</span>
                  </div>
                </div>

                <div className={styles.busInterior}>
                  <div className={styles.frontCabinSide} title="Driver Cabin (Front)">
                    <GiSteeringWheel style={{ fontSize: "24px", color: "#059669" }} />
                    <span>Driver</span>
                    <span style={{ fontSize: "9px", color: "#94a3b8", marginTop: "auto" }}>
                      Front
                    </span>
                  </div>

                  <div className={styles.seatDeckRows}>
                    <div className={styles.doubleRowGroup}>
                      {renderSeatRow("Window (L)", SEATER_WINDOW_TOP)}
                      {renderSeatRow("Aisle (L)", SEATER_AISLE_TOP)}
                    </div>

                    <div className={styles.aisleWalkway}>
                      <span className={styles.aisleText}>&larr; Center Aisle Walkway &rarr;</span>
                    </div>

                    <div className={styles.doubleRowGroup}>
                      {renderSeatRow("Aisle (R)", SEATER_AISLE_BOTTOM)}
                      {renderSeatRow("Window (R)", SEATER_WINDOW_BOTTOM)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: BUS SUMMARY & FARE */}
          <div className={styles.busdata}>
            {busInfo && (
              <div className={styles.summaryCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <FaBus style={{ color: "#1446a0", fontSize: "18px" }} />
                  <h5 className={styles.operatorTitle}>
                    {cleanOperatorName(busInfo?.companyname)}
                  </h5>
                </div>

                <div className={styles.busRouteRow}>
                  <span>{busInfo?.from}</span>
                  <BiArrowFromLeft style={{ fontSize: "20px" }} />
                  <span>{busInfo?.to}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: "#64748b",
                    margin: "8px 0",
                  }}
                >
                  <FaCalendarAlt style={{ color: "#1446a0" }} />
                  <span>
                    Journey Date: <strong>{journeyDate}</strong>
                  </span>
                </div>

                <div className={styles.timingGrid}>
                  <div className={styles.timingBox}>
                    <span className={styles.timingLabel}>Departure</span>
                    <span className={styles.timingValue}>{formatTime(busInfo?.departure)}</span>
                  </div>
                  <div className={styles.timingBox}>
                    <span className={styles.timingLabel}>Arrival</span>
                    <span className={styles.timingValue}>{formatTime(busInfo?.arrival)}</span>
                  </div>
                </div>

                {/* Interactive Original Boarding & Dropping Point Selector */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "12px",
                    margin: "12px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "11px",
                        fontWeight: "800",
                        color: "#1446a0",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      <FaMapMarkerAlt /> Boarding Point ({busInfo?.from})
                    </label>
                    <select
                      className="form-select"
                      value={boardingIdx}
                      onChange={(e) => setBoardingIdx(Number(e.target.value))}
                      style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a" }}
                    >
                      {boardingStops.map((pt, idx) => (
                        <option key={idx} value={idx}>
                          {pt.time} — {pt.name}
                        </option>
                      ))}
                    </select>
                    {selectedBoarding && (
                      <small style={{ color: "#64748b", fontSize: "10.5px", display: "block", marginTop: "3px" }}>
                        Landmark: {selectedBoarding.landmark}
                      </small>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "11px",
                        fontWeight: "800",
                        color: "#059669",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      <FaMapMarkerAlt /> Dropping Point ({busInfo?.to})
                    </label>
                    <select
                      className="form-select"
                      value={droppingIdx}
                      onChange={(e) => setDroppingIdx(Number(e.target.value))}
                      style={{ fontSize: "12.5px", fontWeight: "700", color: "#0f172a" }}
                    >
                      {droppingStops.map((pt, idx) => (
                        <option key={idx} value={idx}>
                          {pt.time} — {pt.name}
                        </option>
                      ))}
                    </select>
                    {selectedDropping && (
                      <small style={{ color: "#64748b", fontSize: "10.5px", display: "block", marginTop: "3px" }}>
                        Landmark: {selectedDropping.landmark}
                      </small>
                    )}
                  </div>
                </div>

                {/* Selected Seats Section */}
                <div className={styles.selectedSeatsSection}>
                  <div className={styles.selectedSeatsHeader}>
                    <span className={styles.selectedSeatsTitle}>
                      Selected {sleeperCoach ? "Berths" : "Seats"}
                    </span>
                    {ticket.length > 0 && (
                      <span className={styles.selectedCountBadge}>
                        {ticket.length} {ticket.length === 1 ? "Seat" : "Seats"}
                      </span>
                    )}
                  </div>

                  {ticket.length === 0 ? (
                    <div className={styles.noSeatsHint}>
                      No seats selected. Click on any available white{" "}
                      {sleeperCoach ? "berth (L1-L15 / U1-U15)" : "seat (1-40)"} to select.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div className={styles.seatBadgeList}>
                        {ticket.map((seatNum) => (
                          <span key={seatNum} className={styles.seatBadge}>
                            {seatNum} &bull; {getSeatBerthLabel(seatNum)}
                            <button
                              type="button"
                              className={styles.seatRemoveBtn}
                              onClick={() => dispatch(removeData(seatNum))}
                              title={`Deselect Seat ${seatNum}`}
                            >
                              <FaTimes />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fare Summary */}
                <div className={styles.fareDetailsSection}>
                  <div className={styles.fareRow}>
                    <span>Base Fare per Seat</span>
                    <span>₹{farePrice}</span>
                  </div>
                  <div className={styles.fareRow}>
                    <span>Seats Selected</span>
                    <span>× {ticket.length}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Total Amount</span>
                    <span className={styles.totalAmount}>₹{ticket.length * farePrice}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.proceedBtn}
                  disabled={ticket.length === 0}
                  onClick={() => handleProceed(farePrice)}
                >
                  {ticket.length === 0
                    ? "Select Seats to Continue"
                    : `Proceed to Book (${ticket.length} ${ticket.length === 1 ? "Seat" : "Seats"}) →`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Bookseat;
