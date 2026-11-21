import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeData, saveData1 } from "../../Redux/ticket/ticket.action";
import { FaCheck, FaMale, FaFemale } from "react-icons/fa";
import { error } from "../../Utils/notification";
import { getSeatBerthLabel } from "../../Utils/converObject";
import "./EachDeckSeat.css";

export default function EachDeckSeat({
  id,
  disable,
  bookedGender = "male",
  fare,
  variant = "sleeper",
}) {
  const dispatch = useDispatch();
  const ticketNo = useSelector((state) => state.ticket?.ticketNo) || [];
  const [isShaking, setIsShaking] = useState(false);

  // Seat is selected if present in Redux ticketNo array (handles string or number id safely)
  const isSelected = ticketNo.some((t) => String(t).trim() === String(id).trim());

  const isFemale =
    String(bookedGender || "").toLowerCase() === "female" ||
    String(bookedGender || "").toLowerCase() === "women";

  const berthDesc = getSeatBerthLabel(id);

  function handleClick(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (disable) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 350);

      if (isFemale) {
        error(
          `Seat ${id} (${berthDesc}) is booked by a female passenger (Ladies reserved seat). Please select another seat.`
        );
      } else {
        error(
          `Seat ${id} (${berthDesc}) is booked by a male passenger. Please select another seat.`
        );
      }
      return;
    }

    if (isSelected) {
      dispatch(removeData(id));
    } else {
      if (ticketNo.length >= 6) {
        error("You can select a maximum of 6 seats in a single booking.");
        return;
      }
      dispatch(saveData1(id));
    }
  }

  let seatClass = "seat-available";
  if (disable) {
    seatClass = isFemale ? "seat-booked-female" : "seat-booked-male";
  } else if (isSelected) {
    seatClass = "seat-selected";
  }

  if (variant === "seater") {
    seatClass += " seat-seater";
  }

  if (isShaking) {
    seatClass += " seat-booked-shake";
  }

  const titleText = disable
    ? isFemale
      ? `Seat ${id} • ${berthDesc} • Booked by Female Passenger (Ladies)`
      : `Seat ${id} • ${berthDesc} • Booked by Male Passenger`
    : isSelected
    ? `Seat ${id} • ${berthDesc} • Selected (Click to Deselect)`
    : `Seat ${id} • ${berthDesc} • Available ₹${fare || ""}`;

  return (
    <div
      className={`seat-container ${seatClass}`}
      onClick={handleClick}
      title={titleText}
      role="button"
      tabIndex={disable ? -1 : 0}
      aria-label={titleText}
    >
      {/* Backrest cushion (Seater) or Pillow (Sleeper) */}
      <div className="seat-pillow" />

      {/* Seat Center Info */}
      <div className="seat-content">
        {disable ? (
          isFemale ? (
            <>
              <div className="seat-number-row">
                <FaFemale style={{ fontSize: "12px", color: "#db2777" }} />
                <span>{id}</span>
              </div>
              <span className="seat-subtext">FEMALE</span>
            </>
          ) : (
            <>
              <div className="seat-number-row">
                <FaMale style={{ fontSize: "12px", color: "#2563eb" }} />
                <span>{id}</span>
              </div>
              <span className="seat-subtext">MALE</span>
            </>
          )
        ) : isSelected ? (
          <>
            <div className="seat-number-row">
              <FaCheck style={{ fontSize: "10px" }} />
              <span>{id}</span>
            </div>
            <span className="seat-subtext">SELECTED</span>
          </>
        ) : (
          <>
            <span className="seat-number">{id}</span>
            {fare ? (
              <span className="seat-subtext" style={{ color: "#475569" }}>
                ₹{fare}
              </span>
            ) : (
              <span className="seat-subtext">READY</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
