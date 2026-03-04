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
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "" // Default to empty to force selection
  });

  const handleChange = (e) => {
    setErrorMsg(""); // Clear errors on typing
    setSuccessMsg("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // Stricter Email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMsg("Please enter a valid real email address (e.g., name@example.com)");
        return;
      }

      // Phone validation
      if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        setErrorMsg("Please enter a valid 10-digit phone number");
        return;
      }

      // Role validation
      if (!formData.role) {
        setErrorMsg("Please select your role (Student or Room Owner)");
        return;
      }

      // Password validation
      if (!formData.password || formData.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters");
        return;
      }

      const response = await api.post("/api/auth/register", formData);
      if (response.status === 200 || response.status === 201) {
        setSuccessMsg(response.data.message || "Registration initiated! Please check your email for the OTP.");
        setStep(2); // Move to OTP verification step
      }
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response?.data?.message || err.message || "Registration failed due to an unexpected error");
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (otp.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await api.post("/api/auth/verify-email", {
        email: formData.email,
        otp: otp
      });

      // You can't use alert reliably, so just navigate to login
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      setErrorMsg(err.response?.data?.message || "Verification failed. Invalid OTP.");
    }
  };

  return (
    <div
      className="register-page"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="register-overlay">
        {step === 1 ? (
          <form className="register-form" onSubmit={handleRegisterSubmit} noValidate>
            <h2>Create Account</h2>

            {errorMsg && <div className="error-message" style={{ color: "red", marginBottom: "10px", textAlign: "center", background: "#fee2e2", padding: "8px", borderRadius: "6px", fontSize: "14px" }}>{errorMsg}</div>}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="" disabled>Select your role</option>
              <option value="student">Student</option>
              <option value="owner">Room Owner</option>
            </select>

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <button type="submit">
  Verify Email
</button>
          </form>
        ) : (
          <form className="register-form" onSubmit={handleVerifySubmit}>
            <h2>Verify Your Email</h2>
            <p style={{ textAlign: "center", marginBottom: "10px", color: "#555" }}>
              We've sent a 6-digit OTP to <strong>{formData.email}</strong>
            </p>

            {successMsg && <div className="success-message" style={{ color: "#166534", marginBottom: "10px", textAlign: "center", background: "#dcfce7", padding: "8px", borderRadius: "6px", fontSize: "14px" }}>{successMsg}</div>}
            {errorMsg && <div className="error-message" style={{ color: "red", marginBottom: "10px", textAlign: "center", background: "#fee2e2", padding: "8px", borderRadius: "6px", fontSize: "14px" }}>{errorMsg}</div>}

            <input
              type="text"
              maxLength="6"
              placeholder="6-Digit OTP"
              value={otp}
              onChange={(e) => {
                setErrorMsg("");
                setOtp(e.target.value.replace(/[^0-9]/g, ''));
              }}
              required
              style={{ textAlign: "center", fontSize: "20px", letterSpacing: "4px", marginTop: "10px" }}
            />

            <button type="submit" style={{ marginTop: "15px" }}>Confirm & Register</button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setSuccessMsg("");
                setErrorMsg("");
              }}
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