const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

/* ================= GET CONVERSATIONS ================= */
router.get("/conversations", protect, async (req, res) => {
  try {
    const myId = req.user.id.toString();

    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .populate("room", "title");

    const conversationsMap = {};

    messages.forEach((msg) => {
      if (!msg.room || !msg.sender || !msg.receiver) return;

      const senderId = msg.sender._id.toString();
      const receiverId = msg.receiver._id.toString();
      const roomId = msg.room._id.toString();

      const otherUser =
        senderId === myId ? msg.receiver : msg.sender;

      // ⭐ UNIQUE KEY (THIS FIXES YOUR ISSUE)
      const convoKey = [roomId, senderId, receiverId]
        .sort()
        .join("_");

      if (!conversationsMap[convoKey]) {
        conversationsMap[convoKey] = {
          roomId,
          ownerId: otherUser._id.toString(),
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

/* ================= GET MESSAGES (USER SPECIFIC) ================= */
router.get("/:roomId/:otherUserId", protect, async (req, res) => {
  try {
    const { roomId, otherUserId } = req.params;
    const myId = req.user.id;

    const messages = await Message.find({
      room: roomId,
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
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

/* ================= SEEN STATUS ================= */
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

    res.json({ message: "Seen updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating seen" });
  }
});

module.exports = router;