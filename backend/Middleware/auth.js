const jwt =require("jsonwebtoken")
const User = require("../Modal/User.js")

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
  

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    console.log("decoded user",user);

    req.user = user;
    console.log(user);

    next();

  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    console.error("Auth middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

// Role-Based Authorization
 const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,                                        
        message: "Access denied. Insufficient permissions."
      });
    }

    next();
  };
};

module.exports={authorize,authenticate}