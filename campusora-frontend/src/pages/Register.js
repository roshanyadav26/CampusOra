import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  // 🔐 Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/rooms");
    }
  }, [navigate]);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "" // Default to empty to force selection
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Stricter Email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid real email address (e.g., name@example.com)");
      return;
    }

    // Phone validation
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // Role validation
    if (!formData.role) {
      alert("Please select your role (Student or Room Owner)");
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await api.post("/api/auth/register", formData);
      alert("Registration initiated! Please check your email for the OTP.");
      setStep(2); // Move to OTP verification step
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await api.post("/api/auth/verify-email", {
        email: formData.email,
        otp: otp
      });

      alert("Email verified successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Verification failed. Invalid OTP.");
    }
  };

  return (
    <div
      className="register-page"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="register-overlay">
        {step === 1 ? (
          <form className="register-form" onSubmit={handleRegisterSubmit}>
            <h2>Create Account</h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="" disabled>Select your role</option>
              <option value="student">Student</option>
              <option value="owner">Room Owner</option>
            </select>

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button type="submit">Verify Email</button>
          </form>
        ) : (
          <form className="register-form" onSubmit={handleVerifySubmit}>
            <h2>Verify Your Email</h2>
            <p style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>
              We've sent a 6-digit OTP to <strong>{formData.email}</strong>
            </p>

            <input
              type="text"
              maxLength="6"
              placeholder="6-Digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // only allow numbers
              required
              style={{ textAlign: "center", fontSize: "20px", letterSpacing: "4px" }}
            />

            <button type="submit" style={{ marginTop: "10px" }}>Confirm & Register</button>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ marginTop: "10px", background: "transparent", border: "1px solid #ccc", color: "#333" }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;