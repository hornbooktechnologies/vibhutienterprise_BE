const permissionDao = require("../dao/permissionDao");
const { ok, error } = require("../utils/responseHandler");

const getAllPermissions = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const permissions = await permissionDao.getAllPermissions(page, limit);
    return ok(res, "Permissions retrieved successfully", permissions);
  } catch (err) {
    console.error("Get All Permissions Error:", err);
    return error(res, 500, "Failed to retrieve permissions");
  }
};

const getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const permissions = await permissionDao.getRolePermissionsFull(roleId);
    return ok(res, "Role permissions retrieved successfully", permissions);
  } catch (err) {
    console.error("Get Role Permissions Error:", err);
    return error(res, 500, "Failed to retrieve role permissions");
  }
};

const updateRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionIds } = req.body;

    if (!roleId || !Array.isArray(permissionIds)) {
      return error(res, 400, "Invalid roleId or permissionIds");
    }

    await permissionDao.updateRolePermissions(roleId, permissionIds);
    return ok(res, "Role permissions updated successfully");
  } catch (err) {
    console.error("Update Role Permissions Error:", err);
    return error(res, 500, "Failed to update role permissions");
  }
};

module.exports = {
  getAllPermissions,
  getRolePermissions,
  updateRolePermissions,
};
