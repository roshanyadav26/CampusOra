import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Rooms.css";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    maxRent: "",
    bhk: "",
    location: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/rooms"
      );
      setRooms(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const applyFilters = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/rooms",
        { params: filters }
      );
      setRooms(res.data);
    } catch (err) {
      console.log("Filter error:", err);
    }
  };

  return (
    <div className="rooms-page">

      {/* FILTER BAR */}
      <div className="filters">
        <input
          type="number"
          placeholder="Max Rent (₹)"
          value={filters.maxRent}
          onChange={e =>
            setFilters({
              ...filters,
              maxRent: e.target.value
            })
          }
        />

        <select
          value={filters.bhk}
          onChange={e =>
            setFilters({
              ...filters,
              bhk: e.target.value
            })
          }
        >
          <option value="">BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={e =>
            setFilters({
              ...filters,
              location: e.target.value
            })
          }
        />

        <button onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {/* ROOMS GRID */}
      <div className="room-grid">
        {rooms.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            No rooms found
          </p>
        ) : (
          rooms.map(room => (
            <div className="room-card" key={room._id}>
              <img
                src={
                  room.images?.length
                    ? `http://localhost:5000/${room.images[0].replace(/\\/g, "/")}`
                    : "/placeholder-room.jpg"
                }
                alt="room"
              />

              <div className="room-info">
  <h3>{room.title}</h3>

  <p className="price">
    ₹{room.rent} / month
  </p>

  <p>
    📍 {room.address || "Location not available"}
  </p>

  <button
    onClick={() =>
      navigate(`/room/${room._id}`)
    }
  >
    View Details
  </button>
</div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Rooms;
