const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");

const {
  addRoom,
  getRooms,
  getRoomById,
  getNearbyRooms,
  getMyRooms,
  deleteRoom,
} = require("../controllers/roomController");

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =========================
   ROUTES
========================= */

// 🔹 Add Room
router.post("/", protect, upload.array("images", 15), addRoom);

// 🔹 Get All Rooms
router.get("/", getRooms);

// 🔹 Get Nearby Rooms
router.get("/nearby", getNearbyRooms);

// 🔹 Get My Rooms (MUST come BEFORE :id)
router.get("/my-rooms", protect, getMyRooms);

// 🔹 Delete Room
router.delete("/:id", protect, deleteRoom);

// 🔹 Get Room By ID (ALWAYS LAST)
router.get("/:id", getRoomById);

module.exports = router;
