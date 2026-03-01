import { useEffect, useState } from "react";
import api from "../api";
import "./MyRooms.css";

function MyRooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api
      .get("/api/rooms/my-rooms", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((res) => setRooms(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="myrooms-page">
      <h2>My Rooms</h2>

      {rooms.length === 0 && <p>No rooms added yet</p>}

      <div className="room-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room._id}>
            <img
              src={`${process.env.REACT_APP_API_URL}/${room.images[0]}`}
              alt="Room"
            />
            <div className="room-info">
              <h3>{room.title}</h3>
              <p>₹{room.rent} / month</p>
              <p>{room.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRooms;