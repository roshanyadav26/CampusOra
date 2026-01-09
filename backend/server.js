const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// =====================
// MIDDLEWARES
// =====================
app.use(cors());
app.use(express.json());

// =====================
// CREATE UPLOADS FOLDER ONCE (CRITICAL FIX)
// =====================
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 uploads folder created");
}

// Serve uploaded images
app.use("/uploads", express.static(uploadDir));

// =====================
// ROUTES
// =====================
app.get("/", (req, res) => {
    res.send("CampusOra backend is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({
        message: "Internal Server Error"
    });
});

// =====================
// START SERVER
// =====================
const PORT = 5000;

app.listen(PORT, () => {
    console.log("✅ Server started successfully on port", PORT);
});
