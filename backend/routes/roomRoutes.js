const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

const {
  addRoom,
  getRooms,
  getRoomById,
  getNearbyRooms,
  getMyRooms,
  deleteRoom,
} = require("../controllers/roomController");

/* =========================
   ROUTES
========================= */

// 🔹 Add Room
router.post("/", protect, upload.array("images", 15), addRoom);

// 🔹 Get All Rooms
router.get("/", getRooms);

// 🔹 Get Nearby Rooms
router.get("/nearby", getNearbyRooms);

// 🔹 Get My Rooms
router.get("/my-rooms", protect, getMyRooms);

// 🔹 Delete Room
router.delete("/:id", protect, deleteRoom);

// 🔹 Get Room By ID (always last)
router.get("/:id", getRoomById);

module.exports = router;