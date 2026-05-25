const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class UserDao {
  static async findUserByEmail(email) {
    const query = `
      SELECT u.*, r.name as role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `;
    const [rows] = await db.query(query, [email]);
    return rows[0];
  }

  static async findUserById(id) {
    const query = `
      SELECT u.*, r.name as role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  static async createUser(userData) {
    const {
      role_id,
      first_name,
      last_name,
      email,
      password,
      mobile,
      status = 1,
    } = userData;
    const userId = uuidv4();
    await db.query(
      "INSERT INTO users (id, role_id, first_name, last_name, email, password, mobile, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, role_id, first_name, last_name, email, password, mobile, status]
    );
    return userId;
  }

  static async updateUser(id, userData) {
    const { role_id, first_name, last_name, email, mobile, status } = userData;
    const [result] = await db.query(
      "UPDATE users SET role_id = ?, first_name = ?, last_name = ?, email = ?, mobile = ?, status = ? WHERE id = ?",
      [role_id, first_name, last_name, email, mobile, status, id]
    );
    return result.affectedRows > 0;
  }

  static async deleteUser(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async getAllUsers(page, limit) {
    let query = `
      SELECT u.id, u.role_id, u.first_name, u.last_name, u.email, u.mobile, u.status, u.created_at, r.name as role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `;
    const params = [];

    if (page && limit) {
      const [countResult] = await db.query("SELECT COUNT(*) as total FROM users");
      const total = countResult[0].total;

      const offset = (page - 1) * limit;
      query += " LIMIT ? OFFSET ?";
      params.push(parseInt(limit), parseInt(offset));

      const [rows] = await db.query(query, params);
      return {
        data: rows,
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    const [rows] = await db.query(query);
    return rows;
  }

  static async updateUserPassword(userId, hashedPassword) {
    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = UserDao;
