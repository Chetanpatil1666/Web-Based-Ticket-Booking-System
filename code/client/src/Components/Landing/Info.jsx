import { success } from "../../Utils/notification";
import styles from "../../Styles/landing.module.css";

function Info() {
  const handleCopyCode = (code) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    success(`🎉 Promo code "${code}" copied! ₹150 OFF applied on your booking.`);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "0 15px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h4 style={{ fontWeight: "800", color: "#1e293b", margin: 0 }}>
          🎁 Exclusive Offers &amp; Promo Codes
        </h4>
        <small style={{ color: "#64748b", fontSize: "13px" }}>
          Click any coupon card to copy your discount code
        </small>
      </div>

      <div className={styles.infogrid}>
        <div
          className={styles.coupon}
          onClick={() => handleCopyCode("FIRST150")}
          style={{ cursor: "pointer", borderRadius: "12px", border: "1.5px dashed #3b82f6" }}
          title="Click to copy promo code"
        >
          <span style={{ fontWeight: "800", color: "#1d4ed8" }}>Save up to ₹150</span>
          <span className={styles.offerImage}>
            <img src={require("../../Images/274_147.png")} alt="coupon-1" />
          </span>
          <span style={{ fontWeight: "700", color: "#059669" }}>
            ✂️ Click to copy: <strong>FIRST150</strong>
          </span>
        </div>

        <div
          className={styles.coupon}
          onClick={() => handleCopyCode("SUPERBUS")}
          style={{ cursor: "pointer", borderRadius: "12px", border: "1.5px dashed #ec4899" }}
          title="Click to copy promo code"
        >
          <span style={{ fontWeight: "800", color: "#be185d" }}>Flat 15% OFF on Return</span>
          <span className={styles.offerImage}>
            <img src={require("../../Images/offertile..png")} alt="coupon-2" />
          </span>
          <span style={{ fontWeight: "700", color: "#059669" }}>
            ✂️ Click to copy: <strong>SUPERBUS</strong>
          </span>
        </div>

        <div
          className={styles.coupon}
          onClick={() => handleCopyCode("SAFETYPLUS")}
          style={{ cursor: "pointer", borderRadius: "12px", border: "1.5px dashed #10b981" }}
          title="Click to copy promo code"
        >
          <span style={{ fontWeight: "800", color: "#047857" }}>Safety+ Extra ₹100 OFF</span>
          <span className={styles.offerImage}>
            <img src={require("../../Images/APSRTC_1.png")} alt="coupon-3" />
          </span>
          <span style={{ fontWeight: "700", color: "#059669" }}>
            ✂️ Click to copy: <strong>SAFETYPLUS</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Info;
