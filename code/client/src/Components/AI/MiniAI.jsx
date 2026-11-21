import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MiniAI.css";

function MiniAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openThinking, setOpenThinking] = useState({});

  const initialGreeting = {
    sender: "ai",
    text: "👋 Hi! I am **BlueBot AI**, your smart Bus Booking & Support Assistant.\n\nI can help you **find buses**, **check PNR status**, explain **pink & blue seats**, show **payment methods**, or troubleshoot **booking issues**!\n\nTry asking me anything below!",
    thinking: "Initialized BlueBot AI assistant. Ready to answer passenger queries and solve booking issues.",
  };

  const [messages, setMessages] = useState([initialGreeting]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    const handleOpenBlueBot = (e) => {
      setIsOpen(true);
      if (e.detail?.initialQuery) {
        handleSend(e.detail.initialQuery);
      }
    };
    window.addEventListener("open-bluebot", handleOpenBlueBot);
    return () => window.removeEventListener("open-bluebot", handleOpenBlueBot);
  }, []);

  const toggleThinking = (index) => {
    setOpenThinking((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleClearChat = () => {
    setMessages([initialGreeting]);
    setOpenThinking({});
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/ai/chat`, { message: query });
      const aiReply = res.data?.reply || "I couldn't process that right now. Please try again!";
      const thinkingText = res.data?.thinking || "Analyzed your request against verified system data.";

      // Small natural delay so the thinking state is felt cleanly
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: aiReply,
            thinking: thinkingText,
          },
        ]);
        setLoading(false);
      }, 400);
    } catch (err) {
      console.error("AI Chat error:", err);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "⚠️ Unable to connect to BlueBot AI right now. Please make sure the backend server is running on port 8080.",
            thinking: `Connection error: Failed to reach ${API_BASE_URL}/ai/chat.`,
          },
        ]);
        setLoading(false);
      }, 300);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Render markdown with bold (**text**), links [text](url), and linebreaks
  const renderMessageText = (text) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <button
          key={match.index}
          onClick={() => {
            setIsOpen(false);
            navigate(url);
          }}
          style={{
            background: "linear-gradient(135deg, #1446a0 0%, #0d2f6c 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "5px 12px",
            fontSize: "12.5px",
            fontWeight: "700",
            cursor: "pointer",
            margin: "6px 0",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            boxShadow: "0 2px 6px rgba(20, 70, 160, 0.25)",
          }}
        >
          {label} ➔
        </button>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.55" }}>
        {parts.map((p, i) => {
          if (typeof p === "string") {
            const boldParts = p.split(/(\*\*.*?\*\*)/g);
            return (
              <span key={i}>
                {boldParts.map((bp, bi) => {
                  if (bp.startsWith("**") && bp.endsWith("**")) {
                    return <strong key={bi}>{bp.slice(2, -2)}</strong>;
                  }
                  return bp;
                })}
              </span>
            );
          }
          return p;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating AI Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            zIndex: 9999,
            background: "linear-gradient(135deg, #1446A0 0%, #0d2f6c 100%)",
            color: "white",
            border: "none",
            borderRadius: "50px",
            padding: "12px 22px",
            boxShadow: "0 8px 24px rgba(20, 70, 160, 0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            fontSize: "14px",
            fontWeight: "800",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          title="Ask BlueBot AI Assistant"
        >
          <span style={{ fontSize: "20px" }}>🤖</span>
          <span>Ask BlueBot AI</span>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
              display: "inline-block",
            }}
          />
        </button>
      )}

      {/* Modern AI Chat Window */}
      {isOpen && (
        <div
          className="chat-window-anim"
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            width: isExpanded ? "460px" : "380px",
            maxHeight: "600px",
            height: "84vh",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.22)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            transition: "width 0.2s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1446A0 0%, #0d2f6c 100%)",
              color: "#ffffff",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "19px",
                }}
              >
                🤖
              </div>
              <div>
                <h6 style={{ margin: 0, fontWeight: "800", fontSize: "15px" }}>BlueBot AI</h6>
                <small style={{ color: "#86efac", fontSize: "11px", fontWeight: "600" }}>
                  ● Master Travel & Support Assistant
                </small>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Clear chat button */}
              <button
                onClick={handleClearChat}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "14px",
                  cursor: "pointer",
                  padding: "4px",
                  opacity: 0.8,
                }}
                title="Clear Chat History"
              >
                🗑️
              </button>

              {/* Expand / Shrink Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "14px",
                  cursor: "pointer",
                  padding: "4px",
                  opacity: 0.8,
                }}
                title={isExpanded ? "Collapse Width" : "Expand Width"}
              >
                {isExpanded ? "⤢" : "⤡"}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "18px",
                  cursor: "pointer",
                  padding: "0 4px",
                  lineHeight: "1",
                  opacity: 0.85,
                }}
                title="Close Chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "8px 10px",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              borderBottom: "1px solid #edf2f7",
            }}
          >
            {[
              "👥 Book 2 tickets (Male & Female)",
              "🌸 Pink vs Blue seats",
              "🎟️ Check PNR Status",
              "💳 Payment options",
              "🚌 Mumbai to Pune",
              "💰 Cheapest buses",
              "🎫 How to book",
              "📋 Refund policy",
              "💻 Run commands",
            ].map((chip, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSend(chip.replace(/^[^\w\s]+/, "").trim())}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Area */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                  backgroundColor: m.sender === "user" ? "#1446A0" : "#ffffff",
                  color: m.sender === "user" ? "#ffffff" : "#1e293b",
                  padding: "10px 14px",
                  borderRadius:
                    m.sender === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  fontSize: "13px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  border: m.sender === "ai" ? "1px solid #e2e8f0" : "none",
                }}
              >
                {/* Expandable Thinking Process Badge */}
                {m.sender === "ai" && m.thinking && (
                  <div className="thinking-accordion">
                    <div
                      className="thinking-toggle"
                      onClick={() => toggleThinking(i)}
                      title="Click to view or hide AI thinking process"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span>🧠</span>
                        <span>Thought Process</span>
                      </div>
                      <span style={{ fontSize: "10px" }}>{openThinking[i] ? "▲" : "▼"}</span>
                    </div>
                    {openThinking[i] && (
                      <div className="thinking-body">
                        {m.thinking}
                      </div>
                    )}
                  </div>
                )}

                {renderMessageText(m.text)}
              </div>
            ))}

            {/* Animated Thinking State */}
            {loading && (
              <div className="ai-thinking-card">
                <div className="ai-thinking-header">
                  <span className="brain-icon-pulse">🧠</span>
                  <span>BlueBot is analyzing & thinking...</span>
                </div>
                <div className="ai-dots-row">
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Check PNR', 'Mumbai to Pune', 'Pink seats')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: "20px",
                border: "1.5px solid #cbd5e1",
                outline: "none",
                fontSize: "13px",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1446A0")}
              onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim()
                  ? "linear-gradient(135deg, #1446A0 0%, #0d2f6c 100%)"
                  : "#cbd5e1",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                fontSize: "14px",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              ➔
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MiniAI;
