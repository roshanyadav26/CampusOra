import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import "./Login.css"; // reusing same styling

function ForgetPassword() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/api/auth/forgot-password",
        { email }
      );

      alert("Password reset email sent successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="login-overlay">
        <form className="login-form" onSubmit={submit}>
          <h2>Forgot Password</h2>

          <p style={{ marginBottom: "15px", fontSize: "14px" }}>
            Enter your email to receive a password reset link.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send Reset Link</button>

          <p style={{ marginTop: "12px", textAlign: "center" }}>
            <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;