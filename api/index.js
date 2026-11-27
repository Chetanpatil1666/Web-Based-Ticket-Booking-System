const app = require("../code/server/index");

module.exports = (req, res) => {
  const matchedPath = req.headers["x-matched-path"] || req.headers["x-forwarded-uri"] || req.url;
  if (matchedPath && matchedPath !== "/api") {
    req.url = matchedPath;
  }
  return app(req, res);
};
