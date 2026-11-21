import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/landing.module.css";

const modalData = {
  "bus-hire": {
    title: "Charter & Bus Hire",
    content: (
      <div>
        <p className="lead" style={{ fontSize: "16px", color: "#444" }}>
          Looking to hire an entire bus for weddings, corporate tours, or pilgrimage trips? BlueBus offers verified private buses with professional drivers.
        </p>
        <ul style={{ textAlign: "left", lineHeight: "1.8", color: "#555" }}>
          <li><strong>Options:</strong> 20-seater Mini Bus, 35-seater Luxury Coach, 50-seater Multi-Axle Volvo.</li>
          <li><strong>Amenities:</strong> Pushback seats, AC, luggage compartment, sound system.</li>
          <li><strong>Pricing:</strong> Transparent per-km rates starting from ₹25/km with no hidden charges.</li>
          <li><strong>Booking Hotline:</strong> 1800-258-3287 (Toll-Free, 24x7).</li>
        </ul>
      </div>
    ),
  },
  "tempo-travellers": {
    title: "Tempo Travellers",
    content: (
      <div>
        <p style={{ fontSize: "16px", color: "#444" }}>
          Ideal for family holidays, weekend road trips, and group outings with comfortable spacious seating.
        </p>
        <ul style={{ textAlign: "left", lineHeight: "1.8", color: "#555" }}>
          <li><strong>Models:</strong> 9, 12, 16, 20 & 26 Seater Force Urbania & Traveller vans.</li>
          <li><strong>Features:</strong> Reclining Maharaja seats, charging points, individual AC vents.</li>
          <li><strong>Sanitization:</strong> Fully sanitized before every departure.</li>
        </ul>
      </div>
    ),
  },
  "car-rentals": {
    title: "Car Rentals & Cabs",
    content: (
      <div>
        <p style={{ fontSize: "16px", color: "#444" }}>
          Book outstation round-trip cabs or hourly local city rentals at fixed low rates.
        </p>
        <ul style={{ textAlign: "left", lineHeight: "1.8", color: "#555" }}>
          <li><strong>Sedans:</strong> Swift Dzire, Honda Amaze (Starting ₹11/km).</li>
          <li><strong>SUVs:</strong> Toyota Innova Crysta, Maruti Ertiga (Starting ₹16/km).</li>
          <li><strong>Highlights:</strong> Zero cancellation fees up to 6 hours before departure.</li>
        </ul>
      </div>
    ),
  },
  about: {
    title: "About BlueBus",
    content: (
      <div>
        <p style={{ fontSize: "15px", color: "#444", lineHeight: "1.7" }}>
          <strong>BlueBus</strong> is India's leading online bus ticketing and travel mobility platform. Founded with the mission to make inter-city travel seamless, affordable, and safe for millions of passengers nationwide.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", margin: "15px 0" }}>
          <div style={{ background: "#f0f4ff", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
            <h4 style={{ color: "#1446A0", margin: "0 0 5px 0" }}>500+</h4>
            <small style={{ color: "#666" }}>Bus Operators</small>
          </div>
          <div style={{ background: "#f0f4ff", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
            <h4 style={{ color: "#1446A0", margin: "0 0 5px 0" }}>100+</h4>
            <small style={{ color: "#666" }}>Cities Connected</small>
          </div>
          <div style={{ background: "#f0f4ff", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
            <h4 style={{ color: "#1446A0", margin: "0 0 5px 0" }}>10M+</h4>
            <small style={{ color: "#666" }}>Happy Travelers</small>
          </div>
        </div>
        <p style={{ fontSize: "14px", color: "#666" }}>
          All partner buses adhere to the <strong>Safety+ Program</strong>, ensuring sanitized coaches, thermal screenings, and live GPS tracking for women safety.
        </p>
      </div>
    ),
  },
  contact: {
    title: "Contact Us & 24x7 Customer Support",
    content: (
      <div style={{ textAlign: "left", color: "#444" }}>
        <p>We are available 24/7 to help you with booking, cancellations, and travel queries.</p>
        <div style={{ marginBottom: "12px" }}>
          <strong>📞 Toll-Free Helpline:</strong> <a href="tel:18002583287" style={{ color: "#1446A0", textDecoration: "none" }}>1800-258-3287</a>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <strong>✉️ Support Email:</strong> <a href="mailto:support@bluebus.in" style={{ color: "#1446A0", textDecoration: "none" }}>support@bluebus.in</a>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <strong>🏢 Headquarters:</strong> BlueBus Mobility Towers, Bandra Kurla Complex, Mumbai, Maharashtra 400051.
        </div>
        <div>
          <strong>⏰ Working Hours:</strong> 24 Hours / 7 Days a Week.
        </div>
      </div>
    ),
  },
  tc: {
    title: "Terms & Conditions",
    content: (
      <div style={{ textAlign: "left", color: "#444", fontSize: "14px", maxHeight: "350px", overflowY: "auto" }}>
        <h5>1. Ticket Booking & Validity</h5>
        <p>A confirmed ticket along with a valid Government ID (Aadhaar, Passport, Driving License) is mandatory during boarding.</p>
        <h5>2. Cancellation & Refund Policy</h5>
        <ul>
          <li><strong>More than 24 hours before departure:</strong> 100% refund (processing charges may apply).</li>
          <li><strong>Between 12 to 24 hours:</strong> 50% refund.</li>
          <li><strong>Less than 12 hours:</strong> No refund applicable.</li>
        </ul>
        <h5>3. Luggage Rules</h5>
        <p>Each passenger is entitled to carry up to 15kg of personal luggage. Commercial cargo is strictly prohibited.</p>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    content: (
      <div style={{ textAlign: "left", color: "#444", fontSize: "14px" }}>
        <p>Your privacy and security are our highest priorities at BlueBus.</p>
        <ul>
          <li><strong>Data Collection:</strong> We collect only necessary details (name, email, phone) to book your tickets and send alerts.</li>
          <li><strong>Security:</strong> All transactions are encrypted via 256-bit SSL encryption. We never store complete debit/credit card numbers.</li>
          <li><strong>No Spam:</strong> Your phone number and email will never be sold or rented to third-party telemarketers.</li>
        </ul>
      </div>
    ),
  },
  cookie: {
    title: "Cookie Policy",
    content: (
      <div style={{ textAlign: "left", color: "#444", fontSize: "14px" }}>
        <p>BlueBus uses cookies to enhance your browsing experience, remember your preferences, and maintain authentication sessions.</p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required to keep you securely signed in and handle seat selections.</li>
          <li><strong>Analytics Cookies:</strong> Help us improve search speed and website performance.</li>
          <li>You can disable cookies anytime in your browser settings.</li>
        </ul>
      </div>
    ),
  },
  faq: {
    title: "Frequently Asked Questions (FAQ)",
    content: (
      <div style={{ textAlign: "left", color: "#444", fontSize: "14px", maxHeight: "350px", overflowY: "auto" }}>
        <div style={{ marginBottom: "15px" }}>
          <strong>Q: How do I book a bus ticket on BlueBus?</strong>
          <p style={{ margin: "4px 0 0 0", color: "#666" }}>A: Enter your source and destination cities, pick your travel date, and click Search. Choose your favorite bus, select your seat, and click Book Seats!</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Q: Where can I view my booked tickets?</strong>
          <p style={{ margin: "4px 0 0 0", color: "#666" }}>A: Log in and click <strong>"My Tickets"</strong> in the top navigation bar to see your current, upcoming, and past tickets.</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Q: Do I need an account to book?</strong>
          <p style={{ margin: "4px 0 0 0", color: "#666" }}>A: Yes, creating a free account ensures your ticket is permanently saved and accessible on any device.</p>
        </div>
        <div>
          <strong>Q: What payment methods are supported?</strong>
          <p style={{ margin: "4px 0 0 0", color: "#666" }}>A: We support UPI, Debit/Credit Cards, Net Banking, and instant demo test booking mode.</p>
        </div>
      </div>
    ),
  },
};

function Footer() {
  const navigate = useNavigate();
  const [activeModalKey, setActiveModalKey] = useState(null);

  useEffect(() => {
    const handleOpenFooterModal = (e) => {
      if (e.detail?.key) {
        setActiveModalKey(e.detail.key);
      }
    };
    window.addEventListener("open-footer-modal", handleOpenFooterModal);
    return () => window.removeEventListener("open-footer-modal", handleOpenFooterModal);
  }, []);

  const handleLinkClick = (key) => {
    if (key === "bus-ticket") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveModalKey(key);
    }
  };

  const closeModal = () => {
    setActiveModalKey(null);
  };

  const modalInfo = activeModalKey ? modalData[activeModalKey] : null;

  return (
    <>
      <footer
        style={{
          paddingTop: "25px",
          backgroundColor: "#1a1a1a",
          color: "#e0e0e0",
          borderTop: "3px solid #5266FA",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <div>
                <h3 style={{ fontWeight: "bold" }}>
                  <span style={{ color: "#5266FA" }}>Blue</span>Bus
                </h3>
                <p className="mb-30" style={{ color: "#a0a0a0", fontSize: "14px", lineHeight: "1.6" }}>
                  India's favorite online bus reservation platform. Travel comfortably across 100+ cities with verified operators, live tracking, and round-the-clock customer support.
                </p>
              </div>
            </div>

            <div className="col-xl-2 offset-xl-1 col-lg-2 col-md-6 mb-4">
              <div>
                <h5 style={{ color: "#ffffff", fontWeight: "600", marginBottom: "15px" }}>Book</h5>
                <ul className="list-unstyled" style={{ lineHeight: "2.2" }}>
                  <li>
                    <span
                      onClick={() => handleLinkClick("bus-ticket")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      Bus Ticket
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => handleLinkClick("bus-hire")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      Bus Hire
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => handleLinkClick("tempo-travellers")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      Tempo Travellers
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => handleLinkClick("car-rentals")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      Car Rentals
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-lg-3 col-md-6 mb-4">
              <div>
                <h5 style={{ color: "#ffffff", fontWeight: "600", marginBottom: "15px" }}>About</h5>
                <ul className="list-unstyled" style={{ lineHeight: "2.2" }}>
                  <li>
                    <span
                      onClick={() => handleLinkClick("about")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      About Us
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => handleLinkClick("contact")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      Contact Us
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-lg-3 col-md-6 mb-4">
              <div>
                <h5 style={{ color: "#ffffff", fontWeight: "600", marginBottom: "15px" }}>Info</h5>
                <ul className="list-unstyled" style={{ lineHeight: "2.2" }}>
                  <li>
                    <span
                      onClick={() => handleLinkClick("tc")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      T &amp; C
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => handleLinkClick("privacy")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      Privacy Policy
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => handleLinkClick("cookie")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      Cookie Policy
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => handleLinkClick("faq")}
                      style={{ cursor: "pointer", color: "#b0b0b0", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#5266FA")}
                      onMouseLeave={(e) => (e.target.style.color = "#b0b0b0")}
                    >
                      FAQ
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center py-3 border-top border-secondary">
            <div className="copyright">
              <p className={styles.companyinfo} style={{ margin: 0, color: "#888", fontSize: "13px" }}>
                © 2026 BlueBus Group. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modal for Footer Links */}
      {modalInfo && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              padding: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              position: "relative",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              animation: "fadeIn 0.25s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "14px", marginBottom: "18px" }}>
              <h4 style={{ margin: 0, color: "#1446A0", fontWeight: "bold" }}>{modalInfo.title}</h4>
              <button
                onClick={closeModal}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#888",
                  lineHeight: "1",
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>{modalInfo.content}</div>

            <div style={{ textAlign: "right", marginTop: "20px", paddingTop: "12px", borderTop: "1px solid #eee" }}>
              <button
                onClick={closeModal}
                className="btn btn-primary"
                style={{ backgroundColor: "#1446A0", borderColor: "#1446A0", padding: "6px 20px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
