const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");
/* ================= EMAIL TRANSPORT ================= */

const resend = new Resend(process.env.RESEND_API_KEY);

/* ================= HELPER ================= */

const sendOTP = async (email, otp) => {
  try {const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/* ================= EMAIL TRANSPORT ================= */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/* ================= HELPER ================= */

const sendOTP = async (email, otp) => {
  try {

    await transporter.sendMail({
      from: `"CampusOra" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "CampusOra - Verify your Email",
      html: `
        <div style="font-family:Arial;max-width:500px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px">
          <h2 style="text-align:center;color:#1f3c88">Welcome to CampusOra</h2>

          <p>Please verify your email using this OTP.</p>

          <div style="text-align:center;margin:20px 0">
            <strong style="font-size:24px;background:#fdf6e3;padding:10px 20px;border-radius:5px;letter-spacing:2px">
              ${otp}
            </strong>
          </div>

          <p style="font-size:14px;color:#777;text-align:center">
            OTP valid for 10 minutes
          </p>
        </div>
      `
    });

    console.log("✅ OTP sent:", email);

  } catch (error) {

    console.error("❌ OTP email failed:", error);
    throw new Error("Email sending failed");

  }
};

/* ================= REGISTER ================= */

const register = async (req, res) => {

  console.log("REGISTER HIT:", req.body);

  try {

    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {

      if (!existingUser.isVerified) {

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        existingUser.verificationOTP = await bcrypt.hash(newOtp, 10);
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.name = name;
        existingUser.phone = phone;
        existingUser.role = role;

        await existingUser.save();

        await sendOTP(existingUser.email, newOtp);

        return res.status(200).json({
          message: "OTP resent to your email."
        });
      }

      return res.status(400).json({
        message: "Email or phone already registered"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationOTP: hashedOTP
    });

    await sendOTP(email, otp);

    res.status(201).json({
      message: "Registration successful. OTP sent to email.",
      email: user.email
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

/* ================= VERIFY EMAIL ================= */

const verifyEmail = async (req, res) => {

  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified"
      });
    }

    const isMatch = await bcrypt.compare(otp, user.verificationOTP);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully"
    });

  } catch (error) {

    console.error("VERIFY ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

/* ================= LOGIN ================= */

const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

/* ================= FORGOT PASSWORD ================= */

const forgotPassword = async (req, res) => {

  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetURL =
      `https://campusora.vercel.app/changePassword/${resetToken}`;

    await transporter.sendMail({
      from: `"CampusOra" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "CampusOra Password Reset",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset password</p>
        <a href="${resetURL}">${resetURL}</a>
      `
    });

    res.json({ message: "Reset email sent" });

  } catch (error) {

    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Email sending failed"
    });
  }
};

/* ================= RESET PASSWORD ================= */

const resetPassword = async (req, res) => {

  try {

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Token expired or invalid"
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password updated"
    });

  } catch (error) {

    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword
};

    await resend.emails.send({
      from: "CampusOra <onboarding@resend.dev>",
      to: email,
      subject: "CampusOra - Verify your Email",
      html: `
        <div style="font-family:Arial;max-width:500px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px">
          <h2 style="text-align:center;color:#1f3c88">Welcome to CampusOra</h2>
          <p>Please verify your email using this OTP.</p>

          <div style="text-align:center;margin:20px 0">
            <strong style="font-size:24px;background:#fdf6e3;padding:10px 20px;border-radius:5px;letter-spacing:2px">
              ${otp}
            </strong>
          </div>

          <p style="font-size:14px;color:#777;text-align:center">
            OTP valid for 10 minutes
          </p>
        </div>
      `
    });

    console.log("✅ OTP sent:", email);

  } catch (error) {
    console.error("❌ OTP email failed:", error);
    throw new Error("Email sending failed");
  }
};
/* ================= REGISTER ================= */

const register = async (req, res) => {

  console.log("REGISTER HIT:", req.body);

  try {

    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    /* ===== USER EXISTS ===== */

    if (existingUser) {

      if (!existingUser.isVerified) {

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        existingUser.verificationOTP = await bcrypt.hash(newOtp, 10);
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.name = name;
        existingUser.phone = phone;
        existingUser.role = role;

        await existingUser.save();

        await sendOTP(existingUser.email, newOtp);

        return res.status(200).json({
          message: "OTP resent to your email."
        });
      }

      return res.status(400).json({
        message: "Email or phone already registered"
      });
    }

    /* ===== PASSWORD CHECK ===== */

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationOTP: hashedOTP
    });

    await sendOTP(email, otp);

    res.status(201).json({
      message: "Registration successful. OTP sent to email.",
      email: user.email
    });

  } catch (error) {

console.error("REGISTER ERROR:", error);
console.error(error.stack);
    res.status(500).json({
      message: "Server error"
    });
  }
};

/* ================= VERIFY EMAIL ================= */

const verifyEmail = async (req, res) => {

  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified"
      });
    }

    const isMatch = await bcrypt.compare(otp, user.verificationOTP);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully"
    });

  } catch (error) {

    console.error("VERIFY ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

/* ================= LOGIN ================= */

const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

/* ================= FORGOT PASSWORD ================= */

const forgotPassword = async (req, res) => {

  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetURL =
      `http://localhost:3000/changePassword/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "CampusOra Password Reset",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset password</p>
        <a href="${resetURL}">${resetURL}</a>
      `
    });

    res.json({ message: "Reset email sent" });

  } catch (error) {

    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Email sending failed"
    });
  }
};

/* ================= RESET PASSWORD ================= */

const resetPassword = async (req, res) => {

  try {

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Token expired or invalid"
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password updated"
    });

  } catch (error) {

    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword
};