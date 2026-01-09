const db = require("../db");
const fs = require("fs");
const path = require("path");

// =====================
// GET ALL ROOMS
// =====================
exports.getRooms = (req, res) => {
    db.query("SELECT * FROM rooms", (err, results) => {
        if (err) {
            console.error("MYSQL ERROR:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json(results);
    });
};

// =====================
// ADD ROOM
// =====================
exports.addRoom = (req, res) => {
    try {
        const { title, bhk, rent, distance, location, description } = req.body;

        // Validate image
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Validate fields
        if (!title || !bhk || !rent || !distance || !location || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Upload directory (ALREADY created in server.js)
        const uploadDir = path.join(__dirname, "../uploads");

        // Safe filename
        const safeFileName =
            Date.now() + "-" + req.file.originalname.replace(/\s+/g, "_");

        const filePath = path.join(uploadDir, safeFileName);

        // Write file (NO mkdir here)
        fs.writeFileSync(filePath, req.file.buffer);

        // Insert into DB
        const sql = `
            INSERT INTO rooms
            (title, bhk, rent, distance, location, description, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [title, bhk, rent, distance, location, description, safeFileName],
            (err) => {
                if (err) {
                    console.error("MYSQL ERROR:", err);
                    return res.status(500).json({
                        message: "Database error",
                        error: err.sqlMessage
                    });
                }

                return res.status(200).json({
                    message: "Room added successfully"
                });
            }
        );
    } catch (error) {
        console.error("SERVER ERROR:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
