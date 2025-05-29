const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  credentials: true,
}));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// DB Connect & Start Server
mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => {
    app.listen(5000, () => console.log(`Server running on port 5000`));
  })
  .catch((err) => console.log("MongoDB connection error:", err));
