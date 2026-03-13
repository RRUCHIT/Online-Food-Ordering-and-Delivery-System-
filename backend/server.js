const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const restaurantRoutes = require("./routes/restaurantRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const menuRoutes = require("./routes/menuRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const path = require("path");

const app = express();

connectDB();

const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/complaints", complaintRoutes);

// Serve Static Assets
// Set static folder
app.use(express.static(path.join(__dirname, "../dist")));

// Catch-all route to serve the frontend for any non-API request
app.use((req, res) => {
  // If the request is for an API route that wasn't handled, return 404
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  // Otherwise, serve the frontend index.html
  res.sendFile(path.resolve(__dirname, "../", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
