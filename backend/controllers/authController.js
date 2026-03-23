const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      restaurantName,
      restaurantDescription,
      cuisine,
      deliveryTime,
      image,
      address,
      phone
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (role === "restaurant") {
      if (!restaurantName || !cuisine || !address || !phone) {
        return res.status(400).json({
          message: "Restaurant profile details are required"
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    if (role === "restaurant") {
      const restaurant = new Restaurant({
        name: restaurantName,
        description: restaurantDescription || "",
        cuisine,
        deliveryTime: deliveryTime || "",
        rating: 0,
        image: image || "",
        address,
        phone,
        ownerId: user._id.toString(),
        ownerName: name,
        ownerEmail: email,
        status: "pending"
      });

      await restaurant.save();
    }

    res.status(201).json({
      message: role === "restaurant"
        ? "Restaurant signup submitted. Wait for admin approval."
        : "User registered successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    if (user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({
        ownerId: user._id.toString()
      });

      if (!restaurant) {
        return res.status(400).json({
          message: "Restaurant profile not found"
        });
      }

      const restaurantStatus = restaurant.status || "approved";

      if (restaurantStatus !== "approved") {
        return res.status(403).json({
          message: restaurantStatus === "rejected"
            ? "Restaurant request was rejected by admin"
            : "Restaurant account is pending admin approval"
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || "SECRETKEY",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
