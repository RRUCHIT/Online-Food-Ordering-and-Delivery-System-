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

app.use(cors());
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

app.get("*", (req, res) => {
  // If the request is for an API route, let it pass (though it should have been caught by the routes above)
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.resolve(__dirname, "../", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
