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

const allowedOrigins = [
  "http://localhost:3000",
  "https://campusora.vercel.app",
  "https://campus-ora.vercel.app"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded images
app.use("/uploads", express.static("uploads"));

/* ================= SOCKET.IO ================= */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
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
    console.log("👤 User registered:", userId);
  });

  /* ===== SEND MESSAGE ===== */
  socket.on("sendMessage", async (data) => {
    try {
      console.log("📨 Incoming message:", data);

      const { roomId, senderId, receiverId, text } = data;

      if (!roomId || !senderId || !receiverId || !text) {
        console.log("❌ Missing message fields");
        return;
      }

      // Save message in DB
      const message = await Message.create({
        room: roomId,
        sender: senderId,
        receiver: receiverId,
        text,
      });

      // populate sender & receiver
      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name")
        .populate("receiver", "name");

      // send to receiver
      io.to(receiverId).emit("receiveMessage", populatedMessage);

      // send back to sender
      io.to(senderId).emit("receiveMessage", populatedMessage);

      console.log("✅ Message delivered");
    } catch (err) {
      console.error("❌ Message error:", err);
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
  res.send("🚀 CampusOra Backend Running");
});

/* ================= DATABASE + SERVER ================= */

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
    console.error("❌ MongoDB connection failed:", err);
  });