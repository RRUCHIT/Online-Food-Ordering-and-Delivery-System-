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
app.get("/", (req, res) => {
  res.send("FoodHub API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
