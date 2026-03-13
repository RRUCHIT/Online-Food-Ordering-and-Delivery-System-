const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRETKEY"
    );

    req.user = verified;

    next();

  } catch (error) {

    res.status(400).json({ message: "Invalid token" });

  }

};


exports.isAdmin = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();

};
