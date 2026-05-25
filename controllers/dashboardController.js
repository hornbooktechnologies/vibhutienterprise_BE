const dashboardDao = require("../dao/dashboardDao");
const logDao = require("../dao/logDao");
const { ok, error } = require("../utils/responseHandler");

const getStats = async (req, res) => {
  try {
    const stats = await dashboardDao.getAdminStats();
    
    // Fetch recent 10 logs to display on admin dashboard
    const recentLogs = await logDao.getLogs(1, 10);
    
    return ok(res, "Admin stats retrieved successfully", {
      stats,
      recentLogs: recentLogs.data,
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    return error(res, 500, "Failed to retrieve dashboard stats");
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await dashboardDao.getUserStats(userId);
    
    // Fetch recent 5 logs of this specific user
    const recentLogs = await logDao.getLogsByUserId(userId, 1, 5);

    return ok(res, "User dashboard data retrieved successfully", {
      stats,
      recentLogs: recentLogs.data,
    });
  } catch (err) {
    console.error("User Dashboard Stats Error:", err);
    return error(res, 500, "Failed to retrieve user dashboard stats");
  }
};

module.exports = {
  getStats,
  getUserDashboard,
};
