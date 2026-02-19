const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

/* ================= GET CONVERSATIONS ================= */
router.get("/conversations", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .populate("room", "title");

    const conversationsMap = {};

    messages.forEach((msg) => {
      const roomId = msg.room._id.toString();

      if (!conversationsMap[roomId]) {
        const otherUser =
          msg.sender._id.toString() === req.user.id.toString()
            ? msg.receiver
            : msg.sender;

        conversationsMap[roomId] = {
          roomId,
          ownerId: otherUser.id,
          ownerName: otherUser.name,
          roomTitle: msg.room.title,
        };
      }
    });

    res.json(Object.values(conversationsMap));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error loading conversations" });
  }
});

/* ================= GET MESSAGES BY ROOM ================= */
router.get("/:roomId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      room: req.params.roomId,
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error loading messages" });
  }
});
router.put("/seen/:roomId", protect, async (req, res) => {
  try {
    await Message.updateMany(
      {
        room: req.params.roomId,
        receiver: req.user.id,
        seen: false,
      },
      { $set: { seen: true } }
    );

    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating seen status" });
  }
});

module.exports = router;
