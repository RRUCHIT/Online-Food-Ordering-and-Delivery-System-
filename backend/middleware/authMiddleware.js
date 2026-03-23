const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  let token = req.headers.authorization || req.headers.Authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  // Handle 'Bearer <token>' format
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRETKEY"
    );
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


exports.isAdmin = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();

};
