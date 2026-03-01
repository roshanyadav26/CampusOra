const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

/* ================= CORS CONFIG ================= */
/* ⭐ OPEN CORS (best for deployment testing) */
app.use(cors());

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  /* ===== REGISTER USER ===== */
  socket.on("registerUser", (userId) => {
    if (!userId) return;
    socket.join(userId);
  });

  /* ===== SEND MESSAGE ===== */
  socket.on("sendMessage", async (data) => {
    try {
      const { roomId, senderId, receiverId, text } = data;
      if (!roomId || !senderId || !receiverId || !text) return;

      const message = await Message.create({
        room: roomId,
        sender: senderId,
        receiver: receiverId,
        text,
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name")
        .populate("receiver", "name");

      io.to(receiverId).emit("receiveMessage", populatedMessage);
      io.to(senderId).emit("receiveMessage", populatedMessage);
    } catch (err) {
      console.error("Message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("🚀 CampusOra Backend Running - LIVE");
});

/* ================= DATABASE ================= */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });
  })
  .catch((err) => console.error(err));