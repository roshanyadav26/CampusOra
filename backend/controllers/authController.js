const db = require("../db");
const bcrypt = require("bcrypt");

// 🔐 REGISTER CONTROLLER WITH FULL VALIDATION
exports.register = (req, res) => {
    const { name, email, phone, password } = req.body;

    // 🔒 Validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[6-9]\d{9}$/;
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    // ❌ Empty fields check
    if (!name || !email || !phone || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // ❌ Email validation
    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    // ❌ Phone validation
    if (!phonePattern.test(phone)) {
        return res.status(400).json({
            message: "Phone number must be 10 digits and start with 6-9"
        });
    }

    // ❌ Password validation
    if (!passwordPattern.test(password)) {
        return res.status(400).json({
            message:
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        });
    }

    // 🔐 Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql =
        "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, phone, hashedPassword], (err) => {
        if (err) {
            // Duplicate email check
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "User registered successfully"
        });
    });
};

// 🔐 LOGIN CONTROLLER (UNCHANGED, BUT CLEAN)
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        res.json({
            message: "Login successful"
        });
    });
};
