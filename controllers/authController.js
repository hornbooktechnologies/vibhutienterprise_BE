const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserDao = require("../dao/userDao");
const permissionDao = require("../dao/permissionDao");
const logDao = require("../dao/logDao");
const { ok, error } = require("../utils/responseHandler");

const signAuthToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "vibhuti_jwt_secret_key_2026", {
    expiresIn: "1d",
  });

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 400, "Email and password are required");
    }

    const user = await UserDao.findUserByEmail(email);
    if (!user) {
      return error(res, 401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 401, "Invalid email or password");
    }

    if (user.status !== 1) {
      return error(res, 403, "Account is inactive");
    }

    // Get permission slugs for this role
    const permissionSlugs = await permissionDao.getPermissionsByRoleId(user.role_id);

    const token = signAuthToken({
      id: user.id,
      role: user.role_name,
      roleId: user.role_id,
      email: user.email,
    });

    await logDao.createLog({
      user_id: user.id,
      action: "LOGIN",
      details: `User logged in: ${user.email}`,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    });
    req.skipActivityLog = true;

    return ok(res, "Login successful", {
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        role: user.role_name,
        permissions: permissionSlugs,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return error(res, 500, "Server error during login", { error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return error(res, 400, "Email is required");
    }

    const user = await UserDao.findUserByEmail(email);
    if (!user) {
      return error(res, 404, "This email address does not exist.");
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
    const resetLink = `${frontendUrl}/reset-password?id=${user.id}`;
    
    // In dev environment, log the reset link to console
    console.log(`[DEV] Forgot Password Link for ${email}: ${resetLink}`);

    await logDao.createLog({
      user_id: user.id,
      action: "FORGOT_PASSWORD",
      details: `Password reset requested for: ${user.email}`,
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
    });
    req.skipActivityLog = true;

    return ok(res, "A password reset link has been simulated in developer console.", { resetLink });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return error(res, 500, "Server error", { error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId, password, confirm_password } = req.body;

    if (!userId || !password || !confirm_password) {
      return error(res, 400, "All fields are required");
    }

    if (password !== confirm_password) {
      return error(res, 400, "Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await UserDao.updateUserPassword(userId, hashedPassword);

    if (updated) {
      await logDao.createLog({
        user_id: userId,
        action: "RESET_PASSWORD",
        details: `Password reset successful for user ID: ${userId}`,
        ip_address: req.ip,
        user_agent: req.get("User-Agent"),
      });
      req.skipActivityLog = true;

      return ok(res, "Your password has been successfully updated.");
    } else {
      return error(res, 400, "Failed to update password. User not found.");
    }
  } catch (err) {
    console.error("Reset Password Error:", err);
    return error(res, 500, "Server error", { error: err.message });
  }
};

module.exports = { login, forgotPassword, resetPassword };
