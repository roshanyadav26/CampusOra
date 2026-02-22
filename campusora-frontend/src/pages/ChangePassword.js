import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";
import "./Login.css";

function ChangePassword() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");

  /* 🔥 IMPORTANT FIX
     If reset token exists → logout any logged user
  */
  useEffect(() => {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();

    try {

      // ================= RESET PASSWORD =================
      if (token) {

        await axios.post(
          `http://localhost:5000/api/auth/reset-password/${token}`,
          { password: newPassword }
        );

        alert("Password reset successful!");
        navigate("/login");
      }

      // ================= NORMAL CHANGE PASSWORD =================
      else {

        await axios.post(
          "http://localhost:5000/api/auth/change-password",
          { oldPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        alert("Password changed successfully!");
        navigate("/rooms");
      }

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
          <h2>{token ? "Reset Password" : "Change Password"}</h2>

          {/* Show old password ONLY for logged user */}
          {!token && (
            <input
              type="password"
              placeholder="Old Password"
              onChange={(e) => setOld(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNew(e.target.value)}
            required
          />

          <button type="submit">
            {token ? "Reset Password" : "Update Password"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ChangePassword;