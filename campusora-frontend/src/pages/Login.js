import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  // 🔐 Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/rooms");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/rooms");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="login-overlay">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
