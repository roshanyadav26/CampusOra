import { useEffect, useState, useCallback } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "./Rooms.css";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    maxRent: "",
    bhk: "",
    location: "",
    wifi: false,
    parking: false,
    furnished: false,
    sort: "",
  });

  const navigate = useNavigate();

  /* ================= FETCH ROOMS ================= */
  const fetchRooms = useCallback(async () => {
    try {
      const res = await api.get("/api/rooms", {
        params: filters,
      });

      setRooms(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  }, [filters]);

  /* ================= AUTO FILTER ================= */
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="rooms-page">

      {/* ===== FILTER BAR ===== */}
      <div className="filters">

        <input
          type="number"
          placeholder="Max Rent (₹)"
          value={filters.maxRent}
          onChange={(e) =>
            setFilters({ ...filters, maxRent: e.target.value })
          }
        />

        <select
          value={filters.bhk}
          onChange={(e) =>
            setFilters({ ...filters, bhk: e.target.value })
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
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />

        <label>
          <input
            type="checkbox"
            checked={filters.wifi}
            onChange={(e) =>
              setFilters({ ...filters, wifi: e.target.checked })
            }
          />
          Wifi
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.parking}
            onChange={(e) =>
              setFilters({ ...filters, parking: e.target.checked })
            }
          />
          Parking
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.furnished}
            onChange={(e) =>
              setFilters({ ...filters, furnished: e.target.checked })
            }
          />
          Furnished
        </label>

        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters({ ...filters, sort: e.target.value })
          }
        >
          <option value="">Sort</option>
          <option value="rentLow">Price Low → High</option>
          <option value="rentHigh">Price High → Low</option>
        </select>

      </div>

      {/* ===== ROOM GRID ===== */}
      <div className="room-grid">
        {rooms.length === 0 ? (
          <p>No rooms found</p>
        ) : (
          rooms.map((room) => (
            <div className="room-card" key={room._id}>

              {/* PRICE BADGE */}
              <div className="price-badge">
                ₹{room.rent}/month
              </div>

              <img
                src={
                  room.images?.length
                    ? `${process.env.REACT_APP_API_URL}/${room.images[0]}`
                    : "/placeholder-room.jpg"
                }
                alt="room"
              />

              <div className="room-info">
                <h3>{room.title}</h3>

                <p className="bhk-tag">
                  🏠 {room.bhk || "N/A"} BHK
                </p>

                <p className="location">
                  📍 {room.address || "Location not available"}
                </p>

                <div className="amenities">
                  {room.amenities?.wifi && (
                    <span className="amenity-badge">Wifi</span>
                  )}
                  {room.amenities?.parking && (
                    <span className="amenity-badge">Parking</span>
                  )}
                  {room.amenities?.furnished && (
                    <span className="amenity-badge">Furnished</span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/room/${room._id}`)}
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