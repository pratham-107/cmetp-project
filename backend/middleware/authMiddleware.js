const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  // console.log("🔐 Auth Middleware hit. Token:", token);

  if (!token) return res.status(401).json({ msg: "No token, unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // console.error("❌ Invalid token:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
}

module.exports = { verifyToken };
