const express = require("express");
const router = express.Router();
const multer = require("multer");
const roomController = require("../controllers/roomController");

// Multer memory storage (NO DISK ACCESS)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.get("/", roomController.getRooms);
router.post("/add", upload.single("image"), roomController.addRoom);

module.exports = router;
