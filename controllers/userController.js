const bcrypt = require("bcryptjs");
const UserDao = require("../dao/userDao");
const { ok, error } = require("../utils/responseHandler");

const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const users = await UserDao.getAllUsers(page, limit);
    return ok(res, "Users retrieved successfully", users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    return error(res, 500, "Failed to retrieve users");
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserDao.findUserById(id);
    if (!user) {
      return error(res, 404, "User not found");
    }
    // Delete password for security
    delete user.password;
    return ok(res, "User retrieved successfully", user);
  } catch (err) {
    console.error("Get User By Id Error:", err);
    return error(res, 500, "Failed to retrieve user");
  }
};

const createUser = async (req, res) => {
  try {
    const { role_id, first_name, last_name, email, password, mobile, status } = req.body;

    if (!role_id || !first_name || !last_name || !email || !password) {
      return error(res, 400, "Required fields are missing");
    }

    const existingUser = await UserDao.findUserByEmail(email);
    if (existingUser) {
      return error(res, 400, "User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await UserDao.createUser({
      role_id,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      mobile,
      status: status !== undefined ? parseInt(status) : 1,
    });

    return ok(res, "User created successfully", { id: userId });
  } catch (err) {
    console.error("Create User Error:", err);
    return error(res, 500, "Failed to create user", { error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, first_name, last_name, email, mobile, status } = req.body;

    if (!role_id || !first_name || !last_name || !email) {
      return error(res, 400, "Required fields are missing");
    }

    const existingUser = await UserDao.findUserById(id);
    if (!existingUser) {
      return error(res, 404, "User not found");
    }

    // Check email uniqueness if it has changed
    if (email !== existingUser.email) {
      const emailCheck = await UserDao.findUserByEmail(email);
      if (emailCheck) {
        return error(res, 400, "Email is already taken");
      }
    }

    const updated = await UserDao.updateUser(id, {
      role_id,
      first_name,
      last_name,
      email,
      mobile,
      status: status !== undefined ? parseInt(status) : 1,
    });

    if (updated) {
      return ok(res, "User updated successfully");
    } else {
      return error(res, 400, "Failed to update user");
    }
  } catch (err) {
    console.error("Update User Error:", err);
    return error(res, 500, "Failed to update user");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (id === req.user.id) {
      return error(res, 400, "You cannot delete your own account");
    }

    const user = await UserDao.findUserById(id);
    if (!user) {
      return error(res, 404, "User not found");
    }

    const deleted = await UserDao.deleteUser(id);
    if (deleted) {
      return ok(res, "User deleted successfully");
    } else {
      return error(res, 400, "Failed to delete user");
    }
  } catch (err) {
    console.error("Delete User Error:", err);
    return error(res, 500, "Failed to delete user");
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await UserDao.findUserById(req.user.id);
    if (!user) {
      return error(res, 404, "User not found");
    }
    delete user.password;
    return ok(res, "User profile retrieved successfully", user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    return error(res, 500, "Failed to retrieve profile");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
};
