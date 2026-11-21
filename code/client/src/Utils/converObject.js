/**
 * Parses any time string (e.g. "8", "20", "21:00", "08:30", "11:30 PM", "6:00 AM", "24:00") into a decimal hour (0 - 24)
 */
export function parseHour(timeVal) {
  if (timeVal === undefined || timeVal === null || timeVal === "") return 0;
  if (typeof timeVal === "number") return timeVal % 24;
  let str = String(timeVal).trim().toUpperCase();
  const isPM = str.includes("PM");
  const isAM = str.includes("AM");
  str = str.replace(/[A-Z\s]/g, "");

  let h = 0;
  let m = 0;
  if (str.includes(":")) {
    const parts = str.split(":");
    h = parseFloat(parts[0]) || 0;
    m = parseFloat(parts[1]) || 0;
  } else {
    h = parseFloat(str) || 0;
    m = 0;
  }

  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  if (h >= 24) h = h % 24;

  return h + m / 60;
}

/**
 * Formats time string (e.g. "8" -> "8:00 AM", "20" -> "8:00 PM", "21:00" -> "9:00 PM")
 */
export function formatTime(timeVal) {
  if (timeVal === undefined || timeVal === null || timeVal === "") return "--:--";
  const str = String(timeVal).trim();
  let hour = 0;
  let minute = 0;
  if (str.includes(":")) {
    const parts = str.split(":");
    hour = parseInt(parts[0], 10) || 0;
    minute = parseInt(parts[1], 10) || 0;
  } else {
    hour = parseInt(str, 10) || 0;
    minute = 0;
  }
  const ampm = hour >= 12 && hour < 24 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute < 10 ? `0${minute}` : minute;
  return `${displayHour}:${displayMinute} ${ampm}`;
}

/**
 * Filters bus array based on criteria:
 * - Bus Types: (SEATER / SLEEPER) and (AC / NONAC)
 * - Departure Time: Before 6am, 6am-12pm, 12pm-6pm, After 6pm
 * - Arrival Time: Before 6am, 6am-12pm, 12pm-6pm, After 6pm
 */
export function filterBuses(buses, filterObj) {
  if (!Array.isArray(buses)) return [];
  if (!filterObj || typeof filterObj !== "object") return buses;

  // Check if any filter is active
  const hasActiveFilter = Object.values(filterObj).some((val) => val === true);
  if (!hasActiveFilter) return buses;

  // Bus type criteria
  const hasSeater = !!filterObj.SEATER;
  const hasSleeper = !!filterObj.SLEEPER;
  const hasAC = !!filterObj.AC;
  const hasNonAC = !!filterObj.NONAC;

  // Departure time criteria
  const depBefore6 = !!filterObj.DTB6;
  const dep6to12 = !!filterObj.DT612;
  const dep12to18 = !!filterObj.DT126;
  const depAfter18 = !!filterObj.DTA6;
  const hasDepFilter = depBefore6 || dep6to12 || dep12to18 || depAfter18;

  // Arrival time criteria
  const arrBefore6 = !!filterObj.ATB6;
  const arr6to12 = !!filterObj.AT612;
  const arr12to18 = !!filterObj.AT126;
  const arrAfter18 = !!filterObj.ATA6;
  const hasArrFilter = arrBefore6 || arr6to12 || arr12to18 || arrAfter18;

  return buses.filter((bus) => {
    const rawAmenities = bus.aminites || [];
    const amenities = rawAmenities.map((a) =>
      String(a).toUpperCase().replace(/[-_ ]/g, "")
    );
    const busTypeStr = `${bus.companyname || ""} ${amenities.join(" ")}`.toUpperCase();

    // 1. Check Seater / Sleeper
    if (hasSeater || hasSleeper) {
      let seatMatch = false;
      if (hasSeater && (amenities.includes("SEATER") || busTypeStr.includes("SEATER"))) {
        seatMatch = true;
      }
      if (hasSleeper && (amenities.includes("SLEEPER") || busTypeStr.includes("SLEEPER"))) {
        seatMatch = true;
      }
      if (!seatMatch) return false;
    }

    // 2. Check AC / Non-AC
    if (hasAC || hasNonAC) {
      let acMatch = false;
      const isAC = amenities.includes("AC") && !amenities.includes("NONAC");
      const isNonAC = amenities.includes("NONAC") || !amenities.includes("AC");
      if (hasAC && isAC) acMatch = true;
      if (hasNonAC && isNonAC) acMatch = true;
      if (!acMatch) return false;
    }

    // 3. Check Departure Time
    if (hasDepFilter) {
      const depHour = parseHour(bus.departure);
      let depMatch = false;
      if (depBefore6 && depHour < 6) depMatch = true;
      if (dep6to12 && depHour >= 6 && depHour < 12) depMatch = true;
      if (dep12to18 && depHour >= 12 && depHour <= 18) depMatch = true;
      if (depAfter18 && depHour >= 18) depMatch = true;
      if (!depMatch) return false;
    }

    // 4. Check Arrival Time
    if (hasArrFilter) {
      const arrHour = parseHour(bus.arrival);
      let arrMatch = false;
      if (arrBefore6 && arrHour < 6) arrMatch = true;
      if (arr6to12 && arrHour >= 6 && arrHour < 12) arrMatch = true;
      if (arr12to18 && arrHour >= 12 && arrHour <= 18) arrMatch = true;
      if (arrAfter18 && arrHour >= 18) arrMatch = true;
      if (!arrMatch) return false;
    }

    return true;
  });
}

// Kept for backward compatibility
export function convertObject(obj) {
  return [];
}

/**
 * Determines whether a bus operates with a 2+1 Sleeper coach configuration
 * (L1-L15 & U1-U15) vs a 2+2 Pushback Seater coach (Seats 1-40).
 */
export function isSleeperBus(bus) {
  if (!bus) return true;
  const amenities = (bus.aminites || []).map((a) => String(a).toUpperCase().trim());
  if (amenities.includes("SLEEPER")) return true;
  if (amenities.includes("SEATER")) return false;
  const name = String(bus.companyname || bus.name || "").toLowerCase();
  if (name.includes("sleeper")) return true;
  if (name.includes("seater") || name.includes("shivshahi") || name.includes("speedster")) return false;
  return true;
}

const LEGACY_SLEEPER_SEAT_MAP = {
  "1": "L1", "2": "L4", "3": "L7", "4": "L10", "5": "L13",
  "11": "L2", "12": "L5", "13": "L8", "14": "L11", "15": "L14",
  "16": "L3", "17": "L6", "18": "L9", "19": "L12", "20": "L15",
  "6": "U1", "7": "U4", "8": "U7", "9": "U10", "10": "U13",
  "21": "U2", "22": "U5", "23": "U8", "24": "U11", "25": "U14",
  "26": "U3", "27": "U6", "28": "U9", "29": "U12", "30": "U15",
};

/**
 * Maps legacy numeric sleeper IDs (1..30) to authentic L1-L15 / U1-U15 berth codes.
 */
export function normalizeSleeperSeatId(seatId) {
  const s = String(seatId || "").trim().toUpperCase();
  if (/^[LU]\d+$/.test(s)) return s;
  return LEGACY_SLEEPER_SEAT_MAP[s] || s;
}

/**
 * Returns the authentic Indian bus berth/seat description from a seat ID.
 */
export function getSeatBerthLabel(seatId) {
  const s = String(seatId || "").trim().toUpperCase();
  const match = s.match(/^([LU])(\d+)$/);
  if (match) {
    const deck = match[1] === "L" ? "Lower" : "Upper";
    const num = parseInt(match[2], 10);
    const mod = (num - 1) % 3;
    if (mod === 0) return `${deck} Single Sleeper (Window)`;
    if (mod === 1) return `${deck} Double Sleeper (Aisle)`;
    return `${deck} Double Sleeper (Window)`;
  }

  const num = parseInt(s, 10);
  if (!isNaN(num)) {
    const pos = (num - 1) % 4;
    return pos === 0 || pos === 3 ? "Pushback Window Seat" : "Pushback Aisle Seat";
  }
  return "Standard Confirmed Berth";
}
