// Central API base URL configured for unified single-URL deployment and local dev.
// In production on Vercel, it routes requests to the same origin (single URL).
// In local development, it defaults to the local Express server on port 8080.
export const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : (typeof window !== "undefined" && window.location.origin ? window.location.origin : "http://localhost:8080"))
).replace(/\/+$/, "");

