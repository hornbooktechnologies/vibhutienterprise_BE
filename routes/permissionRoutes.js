const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authMiddleware");
const {
  getAllPermissions,
  getRolePermissions,
  updateRolePermissions,
} = require("../controllers/permissionController");

router.get("/", protect, authorize("admin"), getAllPermissions);
router.get("/role/:roleId", protect, authorize("admin"), getRolePermissions);
router.put("/role/:roleId", protect, authorize("admin"), updateRolePermissions);

module.exports = router;
