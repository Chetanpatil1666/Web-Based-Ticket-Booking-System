import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterdata } from "../../Redux/filter/filter.action";
import styles from "../../Styles/selectbus.module.css";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaFilter, FaRedo, FaSun, FaMoon, FaCloudSun, FaCloudMoon, FaBus, FaSnowflake, FaBed } from "react-icons/fa";
import { parseHour, filterBuses } from "../../Utils/converObject";
import { success, error } from "../../Utils/notification";

function Filters() {
  const dispatch = useDispatch();
  const backupdata = useSelector((state) => state.filter?.backupdata) || [];

  const initialData1 = {
    SEATER: false,
    SLEEPER: false,
    AC: false,
    NONAC: false,
    DTB6: false,
    DT612: false,
    DT126: false,
    DTA6: false,
    ATB6: false,
    AT612: false,
    AT126: false,
    ATA6: false,
  };

  const [change, setChange] = useState(initialData1);
  const [openSections, setOpenSections] = useState({
    busTypes: true,
    departure: true,
    arrival: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Compute live counts per category from available buses
  const depBefore6Count = backupdata.filter((b) => parseHour(b.departure) < 6).length;
  const dep6to12Count = backupdata.filter((b) => {
    const h = parseHour(b.departure);
    return h >= 6 && h < 12;
  }).length;
  const dep12to18Count = backupdata.filter((b) => {
    const h = parseHour(b.departure);
    return h >= 12 && h <= 18;
  }).length;
  const depAfter18Count = backupdata.filter((b) => parseHour(b.departure) >= 18).length;

  const arrBefore6Count = backupdata.filter((b) => parseHour(b.arrival) < 6).length;
  const arr6to12Count = backupdata.filter((b) => {
    const h = parseHour(b.arrival);
    return h >= 6 && h < 12;
  }).length;
  const arr12to18Count = backupdata.filter((b) => {
    const h = parseHour(b.arrival);
    return h >= 12 && h <= 18;
  }).length;
  const arrAfter18Count = backupdata.filter((b) => parseHour(b.arrival) >= 18).length;

  const seaterCount = backupdata.filter((b) => {
    const am = (b.aminites || []).map((a) => String(a).toUpperCase());
    return am.includes("SEATER") || String(b.companyname || "").toLowerCase().includes("seater");
  }).length;
  const sleeperCount = backupdata.filter((b) => {
    const am = (b.aminites || []).map((a) => String(a).toUpperCase());
    return am.includes("SLEEPER") || String(b.companyname || "").toLowerCase().includes("sleeper");
  }).length;
  const acCount = backupdata.filter((b) =>
    (b.aminites || []).map((a) => String(a).toUpperCase()).includes("AC")
  ).length;
  const nonAcCount = backupdata.filter((b) => {
    const am = (b.aminites || []).map((a) => String(a).toUpperCase());
    return am.includes("NONAC") || !am.includes("AC");
  }).length;

  function handlechange(e) {
    const { name, checked } = e.target;
    const updated = {
      ...change,
      [name]: checked,
    };
    setChange(updated);
    dispatch(filterdata(updated));
  }

  function handleapply() {
    dispatch(filterdata(change));
    const matches = filterBuses(backupdata, change);
    if (matches.length > 0) {
      success(`Filters Applied: Showing ${matches.length} matching bus(es)`);
    } else {
      error("No buses match the selected filter combination. Please try different time slots.");
    }
  }

  function handleClearAll() {
    setChange(initialData1);
    dispatch(filterdata(initialData1));
    success("All filters cleared. Showing all available buses.");
  }

  const activeCount = Object.values(change).filter(Boolean).length;
  const busTypesActive = [change.SEATER, change.SLEEPER, change.AC, change.NONAC].filter(Boolean).length;
  const depActive = [change.DTB6, change.DT612, change.DT126, change.DTA6].filter(Boolean).length;
  const arrActive = [change.ATB6, change.AT612, change.AT126, change.ATA6].filter(Boolean).length;

  return (
    <div style={{ textAlign: "left" }}>
      {/* Active filters summary bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 15px 12px 15px",
        }}
      >
        <span style={{ fontSize: "12.5px", fontWeight: "700", color: activeCount > 0 ? "#1446a0" : "#64748b" }}>
          {activeCount > 0 ? `🟢 ${activeCount} active filter(s)` : "All buses shown"}
        </span>
        {activeCount > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              background: "none",
              border: "none",
              color: "#dc2626",
              fontWeight: "700",
              fontSize: "12.5px",
              cursor: "pointer",
              padding: "0",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FaRedo style={{ fontSize: "10px" }} /> Clear All
          </button>
        )}
      </div>

      <div className="accordion" id="accordionExample">
        {/* 1. BUS TYPES */}
        <div
          className="accordion-item"
          style={{
            border: "1px solid #e2e8f0",
            marginBottom: "10px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          }}
        >
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              onClick={() => toggleSection("busTypes")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "800",
                fontSize: "13px",
                letterSpacing: "0.4px",
                color: "#1e293b",
                backgroundColor: "#f8fafc",
                padding: "12px 16px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FaBus style={{ color: "#1446a0" }} />
                <span>BUS TYPES</span>
                {busTypesActive > 0 && (
                  <span
                    style={{
                      backgroundColor: "#1446a0",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      marginLeft: "4px",
                    }}
                  >
                    {busTypesActive}
                  </span>
                )}
              </div>
              {openSections.busTypes ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </h2>
          {openSections.busTypes && (
            <div className="accordion-body" style={{ padding: "12px 16px", backgroundColor: "#fff" }}>
              <div className={styles.compartment} style={{ paddingLeft: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.SEATER}
                      name="SEATER"
                      id="filter-seater"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-seater" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      💺 SEATER
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({seaterCount})</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.SLEEPER}
                      name="SLEEPER"
                      id="filter-sleeper"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-sleeper" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      🛏️ SLEEPER
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({sleeperCount})</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.AC}
                      name="AC"
                      id="filter-ac"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-ac" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      ❄️ AC
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({acCount})</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.NONAC}
                      name="NONAC"
                      id="filter-nonac"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-nonac" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      🍃 NON-AC
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({nonAcCount})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. DEPARTURE TIME */}
        <div
          className="accordion-item"
          style={{
            border: "1px solid #e2e8f0",
            marginBottom: "10px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          }}
        >
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button"
              type="button"
              onClick={() => toggleSection("departure")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "800",
                fontSize: "13px",
                letterSpacing: "0.4px",
                color: "#1e293b",
                backgroundColor: "#f8fafc",
                padding: "12px 16px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>⏰</span>
                <span>DEPARTURE TIME</span>
                {depActive > 0 && (
                  <span
                    style={{
                      backgroundColor: "#1446a0",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      marginLeft: "4px",
                    }}
                  >
                    {depActive}
                  </span>
                )}
              </div>
              {openSections.departure ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </h2>
          {openSections.departure && (
            <div className="accordion-body" style={{ padding: "12px 16px", backgroundColor: "#fff" }}>
              <div className={styles.compartment} style={{ paddingLeft: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.DTB6}
                      name="DTB6"
                      id="filter-dtb6"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-dtb6" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      🌙 Before 6 am
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({depBefore6Count})</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.DT612}
                      name="DT612"
                      id="filter-dt612"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-dt612" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      🌅 6 am to 12 pm
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({dep6to12Count})</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.DT126}
                      name="DT126"
                      id="filter-dt126"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-dt126" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      ☀️ 12 pm to 6 pm
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({dep12to18Count})</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.DTA6}
                      name="DTA6"
                      id="filter-dta6"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-dta6" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      🌃 After 6 pm
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({depAfter18Count})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. ARRIVAL TIME */}
        <div
          className="accordion-item"
          style={{
            border: "1px solid #e2e8f0",
            marginBottom: "12px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          }}
        >
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button"
              type="button"
              onClick={() => toggleSection("arrival")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "800",
                fontSize: "13px",
                letterSpacing: "0.4px",
                color: "#1e293b",
                backgroundColor: "#f8fafc",
                padding: "12px 16px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🏁</span>
                <span>ARRIVAL TIME</span>
                {arrActive > 0 && (
                  <span
                    style={{
                      backgroundColor: "#1446a0",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      marginLeft: "4px",
                    }}
                  >
                    {arrActive}
                  </span>
                )}
              </div>
              {openSections.arrival ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </h2>
          {openSections.arrival && (
            <div className="accordion-body" style={{ padding: "12px 16px", backgroundColor: "#fff" }}>
              <div className={styles.compartment} style={{ paddingLeft: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.ATB6}
                      name="ATB6"
                      id="filter-atb6"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-atb6" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      🌙 Before 6 am
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({arrBefore6Count})</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.AT612}
                      name="AT612"
                      id="filter-at612"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-at612" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      🌅 6 am to 12 pm
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({arr6to12Count})</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "9px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.AT126}
                      name="AT126"
                      id="filter-at126"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-at126" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      ☀️ 12 pm to 6 pm
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({arr12to18Count})</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      checked={change.ATA6}
                      name="ATA6"
                      id="filter-ata6"
                      onChange={handlechange}
                      type="checkbox"
                      style={{ cursor: "pointer", width: "17px", height: "17px", marginRight: "10px" }}
                    />
                    <label htmlFor="filter-ata6" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: "600", margin: "0", color: "#334155" }}>
                      🌃 After 6 pm
                    </label>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "700" }}>({arrAfter18Count})</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Unified Apply Filter Button */}
      <div style={{ padding: "0 6px", marginTop: "12px" }}>
        <button
          type="button"
          onClick={handleapply}
          style={{
            width: "100%",
            backgroundColor: "#1446a0",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "11px 16px",
            fontSize: "13.5px",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(20, 70, 160, 0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0d2f6c")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1446a0")}
        >
          <FaFilter />
          <span>Apply Filter {activeCount > 0 ? `(${activeCount})` : ""}</span>
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            style={{
              width: "100%",
              marginTop: "8px",
              backgroundColor: "#f8fafc",
              color: "#64748b",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "7px 12px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default Filters;
