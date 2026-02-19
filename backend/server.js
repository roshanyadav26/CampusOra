const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  /* ===== REGISTER USER SOCKET ===== */
  socket.on("registerUser", (userId) => {
    if (!userId) {
      console.log("❌ registerUser missing userId");
      return;
    }

    socket.join(userId);
    console.log("👤 User registered in socket room:", userId);
  });

  /* ===== SEND MESSAGE ===== */
  socket.on("sendMessage", async (data) => {
    try {
      console.log("📨 Incoming message:", data);

      const { roomId, senderId, receiverId, text } = data;

      if (!roomId || !senderId || !receiverId || !text) {
        console.log("❌ Missing required message fields");
        return;
      }

      // Save message to database
      const message = await Message.create({
        room: roomId,
        sender: senderId,
        receiver: receiverId,
        text,
      });

      // Populate sender & receiver
      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name")
        .populate("receiver", "name");

      // Emit to receiver
      console.log("🚀 Emitting to receiver:", receiverId);
      io.to(receiverId).emit("receiveMessage", populatedMessage);

      // Emit back to sender
      console.log("🚀 Emitting back to sender:", senderId);
      io.to(senderId).emit("receiveMessage", populatedMessage);

      console.log("✅ Message successfully delivered");

    } catch (err) {
      console.error("❌ Message save failed:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("🚀 CampusOra Backend Running");
});

/* ================= DATABASE CONNECTION ================= */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
