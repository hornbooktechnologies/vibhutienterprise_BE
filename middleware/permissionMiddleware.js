const permissionDao = require("../dao/permissionDao");
const { error } = require("../utils/responseHandler");

const checkPermission = (requiredPermission, allowRoles = []) => {
  return async (req, res, next) => {
    try {
      const userRole = (req.user.role || "").toLowerCase();
      const requiredPermissions = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];

      // Admin role has full access (role bypass or explicit check)
      if (userRole === "admin") {
        return next();
      }

      const normalizedAllowRoles = (allowRoles || []).map((role) =>
        String(role).toLowerCase()
      );
      if (normalizedAllowRoles.includes(userRole)) {
        return next();
      }

      const roleId = req.user.roleId;
      const permissions = await permissionDao.getPermissionsByRoleId(roleId);

      if (requiredPermissions.some((permission) => permissions.includes(permission))) {
        return next();
      }

      return error(res, 403, "Access denied. Insufficient permissions.", {
        code: "PERMISSION_DENIED",
        required: requiredPermissions,
      });
    } catch (err) {
      console.error("Permission Check Error:", err);
      return error(res, 500, "Internal server error during permission check");
    }
  };
};

module.exports = checkPermission;
