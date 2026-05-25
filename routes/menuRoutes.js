const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getSidebarMenu } = require("../controllers/menuController");

router.get("/", protect, getSidebarMenu);

module.exports = router;
