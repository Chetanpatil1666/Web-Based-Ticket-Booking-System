const mongoose = require("mongoose");

const mongoUri = "mongodb://127.0.0.1:27017/newbus";

const LEGACY_SLEEPER_SEAT_MAP = {
  "1": "L1", "2": "L4", "3": "L7", "4": "L10", "5": "L13",
  "11": "L2", "12": "L5", "13": "L8", "14": "L11", "15": "L14",
  "16": "L3", "17": "L6", "18": "L9", "19": "L12", "20": "L15",
  "6": "U1", "7": "U4", "8": "U7", "9": "U10", "10": "U13",
  "21": "U2", "22": "U5", "23": "U8", "24": "U11", "25": "U14",
  "26": "U3", "27": "U6", "28": "U9", "29": "U12", "30": "U15",
};

function isSleeperBusDoc(bus) {
  if (!bus) return true;
  const amenities = (bus.aminites || []).map((a) => String(a).toUpperCase().trim());
  if (amenities.includes("SLEEPER")) return true;
  if (amenities.includes("SEATER")) return false;
  return true;
}

function getSeatBerthLabel(seatId) {
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

async function syncAllTickets() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB:", mongoUri);

  const ordersCol = mongoose.connection.db.collection("ordersses");
  const bussesCol = mongoose.connection.db.collection("busses");

  const docs = await ordersCol.find({}).toArray();
  console.log(`Found ${docs.length} orders in 'ordersses' to standardize.`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const bus = doc.bus ? await bussesCol.findOne({ _id: doc.bus }) : null;
    const isSleeper = isSleeperBusDoc(bus);

    const pnrCode = doc.pnr || `PNR-PJ-${78401 + i}`;
    const rawSeatStr = String(doc.ticketSummary?.ticket || String(i + 1));
    const seatTokens = rawSeatStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedSeatTokens = seatTokens.map((token) => {
      if (isSleeper) {
        const up = token.toUpperCase();
        return /^[LU]\d+$/.test(up) ? up : LEGACY_SLEEPER_SEAT_MAP[token] || `L${(i % 15) + 1}`;
      }
      // For Seater buses, ensure clean numeric seat ID (1..40)
      const num = parseInt(token.replace(/\D/g, ""), 10);
      return num >= 1 && num <= 40 ? String(num) : String((i % 40) + 1);
    });

    const updatedTicketStr = updatedSeatTokens.join(",");

    let existingPassengers = Array.isArray(doc.passengers) && doc.passengers.length > 0
      ? doc.passengers
      : [
          {
            name: doc.userDetails?.name || `Passenger ${i + 1}`,
            age: doc.userDetails?.age || (24 + (i % 8)),
            gender: doc.userDetails?.gender || (i % 3 === 0 ? "female" : "male"),
          },
        ];

    const updatedPassengers = updatedSeatTokens.map((seatCode, pIdx) => {
      const pInfo = existingPassengers[pIdx] || existingPassengers[0];
      return {
        seat: seatCode,
        berth: getSeatBerthLabel(seatCode),
        name: pInfo.name || doc.userDetails?.name || `Passenger ${i + 1}`,
        age: pInfo.age || doc.userDetails?.age || 26,
        gender: pInfo.gender || doc.userDetails?.gender || "male",
      };
    });

    await ordersCol.updateOne(
      { _id: doc._id },
      {
        $set: {
          pnr: pnrCode,
          "busDetails.from": "Pune",
          "busDetails.to": "Jalgaon",
          ...(bus?.companyname ? { "busDetails.name": bus.companyname } : {}),
          "ticketSummary.ticket": updatedTicketStr,
          passengers: updatedPassengers,
        },
      }
    );
    console.log(
      `[OK] Order ${i + 1}: ${pnrCode} | ${bus?.companyname || doc.busDetails?.name} (${isSleeper ? "Sleeper" : "Seater"}) | Seats: ${updatedTicketStr} (${updatedPassengers[0].berth})`
    );
  }

  console.log("All orders updated with original Sleeper (L1-L15/U1-U15) & Seater (1-40) numbers!");
  await mongoose.disconnect();
  process.exit(0);
}

syncAllTickets().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
