import { useEffect, useState } from "react";
import api from "../api";

function OwnerDashboard() {
  const [rooms, setRooms] = useState([]);

  const fetchMyRooms = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/api/rooms/my-rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms", error);
    }
  };

  const deleteRoom = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/api/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Room deleted successfully");
      fetchMyRooms();
    } catch (error) {
      console.error("Error deleting room", error);
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Listed Rooms</h2>

      {rooms.length === 0 ? (
        <p>No rooms listed yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {rooms.map((room) => (
            <div
              key={room._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              {room.images && room.images.length > 0 && (
                <img
                  src={`${process.env.REACT_APP_API_URL}/${room.images[0]}`}
                  alt="room"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}

              <h3>{room.title}</h3>
              <p><strong>Rent:</strong> ₹{room.rent}</p>
              <p><strong>Sharing:</strong> {room.sharingType}</p>
              <p><strong>Gender:</strong> {room.genderPreference}</p>
              <p><strong>Furnished:</strong> {room.furnished ? "Yes" : "No"}</p>

              <button
                onClick={() => deleteRoom(room._id)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete Room
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;