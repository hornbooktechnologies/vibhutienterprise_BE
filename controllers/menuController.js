const menuItems = require("../config/menuConfig");
const permissionDao = require("../dao/permissionDao");
const { ok, error } = require("../utils/responseHandler");

const getSidebarMenu = async (req, res) => {
  try {
    const roleId = req.user.roleId; 
    const userRole = (req.user.role || "").toLowerCase();

    // If Admin, they get everything, so bypass permission checks for simplicity
    if (userRole === "admin") {
      return ok(res, "Menu fetched successfully", menuItems);
    }

    // Fetch permissions for the user's role
    const userPermissions = await permissionDao.getPermissionsByRoleId(roleId);

    // Filter menu items
    const filteredMenu = menuItems.reduce((acc, item) => {
      // Check if main item is allowed
      if (item.permission && !userPermissions.includes(item.permission)) {
        return acc;
      }

      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(
          (sub) => !sub.permission || userPermissions.includes(sub.permission)
        );

        if (filteredSubItems.length > 0) {
          acc.push({ ...item, subItems: filteredSubItems });
        } else if (!item.subItems.length || (item.link && item.link !== "#")) {
          acc.push({ ...item, subItems: [] });
        }
      } else {
        acc.push(item);
      }

      return acc;
    }, []);

    return ok(res, "Menu fetched successfully", filteredMenu);
  } catch (err) {
    console.error("Get Menu Error:", err);
    return error(res, 500, "Internal server error");
  }
};

module.exports = {
  getSidebarMenu,
};
