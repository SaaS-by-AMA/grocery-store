// server/middlewares/authSeller.js
import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  try {
   

    // Accept token from cookie OR Authorization header
    let token = req.cookies?.sellerToken || req.cookies?.access || null;
    if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "No authentication token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("authSeller - token verify error:", err.message);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Session expired. Please login again." });
      }
      return res.status(401).json({ success: false, message: "Invalid authentication token" });
    }

    // Attach seller info for controllers
    req.seller = {
      id: decoded.id || decoded._id || decoded.sub || null,
      email: decoded.email || null,
      role: decoded.role || null
    };

    return next();
  } catch (error) {
    console.error("authSeller unexpected error:", error);
    return res.status(500).json({ success: false, message: "Server error in auth" });
  }
};

export default authSeller;
