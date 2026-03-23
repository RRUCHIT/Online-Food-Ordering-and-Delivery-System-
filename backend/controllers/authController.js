const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/email");

const normalizePhone = (phone) => {
  // The frontend now sends the E.164 format, so we just do a basic cleanup.
  if (!phone) return "";
  return phone.replace(/\s/g, "");
};

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

    const normalizedPhone = normalizePhone(phone);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone: normalizedPhone
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
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // --- Send Email via Nodemailer ---
    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (EMAIL_USER && EMAIL_PASS) {
      try {
        console.log(`Attempting to send email to ${user.email}...`);
        await sendEmail({
          email: user.email,
          subject: "Password Reset OTP - FoodHub",
          message: `Your FoodHub verification code is: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #f43f5e;">FoodHub Password Reset</h2>
              <p>Hello ${user.name},</p>
              <p>You requested a password reset. Use the OTP below to verify your request. This code is valid for 5 minutes.</p>
              <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #f43f5e; border-radius: 8px;">
                ${otp}
              </div>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,<br/>FoodHub Team</p>
            </div>
          `,
        });
        console.log(`Email sent to ${user.email}`);
      } catch (emailError) {
        console.error("Email Error:", emailError.message);
        // Fallback to console log if Email fails
        console.log(`OTP for ${user.email}: ${otp} (Email failed)`);
      }
    } else {
      // Fallback for development if Email config is not set
      console.log(`OTP for ${user.email}: ${otp} (Email not configured)`);
    }

    res.json({ message: "An OTP has been sent to your registered email address." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or request" });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = normalizePhone(phone);
    if (address) user.address = address; // Added address support

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
