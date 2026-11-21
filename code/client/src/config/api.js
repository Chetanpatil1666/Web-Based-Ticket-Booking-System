// Central API base URL configured for both local development and production deployment.
// Set REACT_APP_API_URL in your hosting environment (Vercel, Netlify, Render, etc.).
export const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

