const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authMiddleware");
const { getStats, getUserDashboard } = require("../controllers/dashboardController");

router.get("/stats", protect, authorize("admin"), getStats);
router.get("/user", protect, getUserDashboard);

module.exports = router;
