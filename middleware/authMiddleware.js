const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseHandler");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "vibhuti_jwt_secret_key_2026"
      );
      req.user = decoded;
      next();
      return;
    } catch (err) {
      return error(res, 401, "Not authorized, token failed");
    }
  }

  if (!token) {
    return error(res, 401, "Not authorized, no token");
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 401, "User not authenticated");
    }

    const userRole = req.user.role;
    const allowedRoles = roles.map((r) => r.toLowerCase());
    
    if (!allowedRoles.includes(userRole.toLowerCase())) {
      return error(
        res,
        403,
        "User role is not authorized to access this route"
      );
    }
    next();
  };
};

module.exports = protect;
module.exports.protect = protect;
module.exports.authorize = authorize;
