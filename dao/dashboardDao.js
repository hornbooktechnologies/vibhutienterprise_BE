const db = require("../config/db");

class DashboardDao {
  static async getAdminStats() {
    const [userCountRows] = await db.query("SELECT COUNT(*) as count FROM users");
    const [roleCountRows] = await db.query("SELECT COUNT(*) as count FROM roles");
    const [activeUserRows] = await db.query("SELECT COUNT(*) as count FROM users WHERE status = 1");
    const [recentLogsRows] = await db.query("SELECT COUNT(*) as count FROM activity_logs");

    return {
      totalUsers: userCountRows[0].count,
      totalRoles: roleCountRows[0].count,
      activeUsers: activeUserRows[0].count,
      totalLogs: recentLogsRows[0].count,
    };
  }

  static async getUserStats(userId) {
    const [userRows] = await db.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.mobile, r.name as role_name 
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );

    const [logsRows] = await db.query(
      "SELECT COUNT(*) as count FROM activity_logs WHERE user_id = ?",
      [userId]
    );

    return {
      profile: userRows[0] || null,
      activityCount: logsRows[0]?.count || 0,
    };
  }
}

module.exports = DashboardDao;
