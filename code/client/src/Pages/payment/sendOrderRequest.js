import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import Cookies from "js-cookie";
import { removeall } from "../../Redux/ticket/ticket.action";
import { success, error } from "../../Utils/notification";

export const sendOrderRequest = async (
  busdata,
  creds,
  orderId,
  response,
  date,
  ticket,
  busid,
  userid,
  amount,
  token,
  dispatch,
  navigate
) => {
  const busInfo = (Array.isArray(busdata) && busdata.length > 0) ? busdata[0] : (busdata || {});

  let ticketSummary = {
    date: date || new Date().toISOString().split("T")[0],
    ticket: String(ticket || "1"),
    amount: amount || 500,
  };

  let userDetails = {
    name: creds.name || "Passenger",
    age: creds.age || 25,
    gender: creds.gender || "male",
    email: creds.email || "passenger@example.com",
    phone: creds.phone || creds.mobile || "9876543210",
  };

  let busDetails = {
    name: busInfo.companyname || "Travels",
    from: busInfo.from || "Source",
    to: busInfo.to || "Destination",
    contactemail: busInfo.email || "support@travels.com",
    contactphone: busInfo.phone || 9820011223,
    arrival: busInfo.arrival || "10:00",
    departure: busInfo.departure || "08:00",
    boardingPoint: creds.boardingPoint || busInfo.boardingPoint || "",
    droppingPoint: creds.droppingPoint || busInfo.droppingPoint || "",
  };

  const payload = {
    busDetails,
    ticketSummary,
    paymentDetails: {
      orderId: orderId || "order_" + Date.now(),
      razorpayOrderId: response?.razorpay_order_id || orderId || "order_" + Date.now(),
      razorpayPaymentId: response?.razorpay_payment_id || "pay_" + Date.now(),
    },
    userDetails,
    passengers: Array.isArray(creds.passengers) ? creds.passengers : [],
    bus: busid,
    user: userid || Cookies.get("userid"),
  };

  try {
    const config = {};
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    const res = await axios.post(`${API_BASE_URL}/order`, payload, config);

    if (res.data?.user) {
      Cookies.set("userid", res.data.user, { expires: 7 });
      if (!Cookies.get("jwttoken")) {
        Cookies.set("jwttoken", "session_" + res.data.user, { expires: 7 });
      }
    }
    if (creds.gender) {
      Cookies.set("usergender", creds.gender, { expires: 7 });
    }

    success("Ticket Booked successfully!");
    if (dispatch) dispatch(removeall());
    return { success: true, order: res.data };
  } catch (err) {
    console.error("Order creation failed:", err);
    const serverMsg = err.response?.data?.error || err.response?.data?.message;
    error(serverMsg || "Unable to complete booking. Please try again.");
    return { success: false, error: err };
  }
};
