import { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      alert("Password changed");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        type="password"
        placeholder="Old Password"
        onChange={(e) => setOld(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNew(e.target.value)}
      />
      <button>Update Password</button>
    </form>
  );
}

export default ChangePassword;
