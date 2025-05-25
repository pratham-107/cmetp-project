const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please fill all fields" });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ msg: "User registered" });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // console.log("➡️ Login attempt:", email);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      // console.log("❌ User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    // console.log("🔍 Found user:", user.email);

    const match = await bcrypt.compare(password, user.password);
    // console.log("✅ Password match result:", match);

    if (!match) {
      // console.log("❌ Incorrect password");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    // console.log("✅ Login successful:", user.email);

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    // console.error("💥 Login error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
