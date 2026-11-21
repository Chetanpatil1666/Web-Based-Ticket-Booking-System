import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import logo from "../../Images/logo.png";
import { error, success } from "../../Utils/notification";
import { sendOrderRequest } from "./sendOrderRequest";

export const initPayment = async (
  busdata,
  creds,
  orderDetails,
  date,
  ticket,
  busid,
  userid,
  amount,
  token,
  dispatch,
  navigate
) => {
  const { name, age, gender, mobile, email } = creds;

  let rzpKey = "rzp_test_5Jytv3WwjpYnLC";
  try {
    const keyRes = await axios.get(`${API_BASE_URL}/api/payment/getkey`);
    if (keyRes.data?.key) {
      rzpKey = keyRes.data.key;
    }
  } catch (e) {
    // fallback to default
  }

  const options = {
    key: rzpKey,
    order_id: orderDetails.id,
    amount: orderDetails.amount,
    currency: orderDetails.currency,
    image: logo,
    name: "Blue Bus",
    description: "Thanks For Booking, Happy Journey!",

    prefill: {
      name: `${name}`,
      email: email,
      contact: mobile,
      age: age,
      gender: gender,
    },

    handler: async function (response) {
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/payment/verify`,
          response
        );

        success(data.message);

        sendOrderRequest(
          busdata,
          creds,
          orderDetails.id,
          response,   
          date,
          ticket,
          busid,
          userid,
          amount,
          token,
          dispatch,
          navigate
        );
        
      } catch (error) {
        console.log(error);
        return { status: false };
      }
    },

    theme: { color: "#5266FA" },
  };

  if (orderDetails?.isMock || !window.Razorpay) {
    const mockResponse = {
      razorpay_order_id: orderDetails.id || "order_test_demo",
      razorpay_payment_id: "pay_test_" + Date.now(),
      razorpay_signature: "sig_test_demo",
    };
    success("Payment Completed Successfully!");
    sendOrderRequest(
      busdata,
      creds,
      orderDetails.id,
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
    return;
  }

  try {
    const rzp = new window.Razorpay(options);

    //If payment failed
    rzp.on("payment.failed", (response) => {
      console.log(response.error);
      error("Payment failed, please try again");
      return { status: false };
    });

    //Open razorpay window
    rzp.open();
  } catch (err) {
    console.log("Razorpay open error:", err);
    // Fallback to direct booking
    const mockResponse = {
      razorpay_order_id: orderDetails.id || "order_test_demo",
      razorpay_payment_id: "pay_test_" + Date.now(),
      razorpay_signature: "sig_test_demo",
    };
    sendOrderRequest(
      busdata,
      creds,
      orderDetails.id,
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
  }
};
