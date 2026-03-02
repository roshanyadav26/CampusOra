import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import heroImage from "../assets/hero.png";
import "./Home.css";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAllRooms = async () => {
      try {
        const res = await api.get("/api/rooms");
        setRooms(res.data);
      } catch (err) {
        console.log("Failed loading rooms", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchNearby = async (lat, lng) => {
      try {
        const nearby = await api.get("/api/rooms/nearby", {
          params: { lat, lng },
        });

        if (!nearby.data || nearby.data.length === 0) {
          loadAllRooms();
        } else {
          setRooms(nearby.data);
          setLoading(false);
        }
      } catch {
        loadAllRooms();
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          fetchNearby(
            pos.coords.latitude,
            pos.coords.longitude
          ),
        () => loadAllRooms()
      );
    } else {
      loadAllRooms();
    }
  }, []);

  return (
    <>
      <div
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay">
          <div className="hero-center">
            <h1 className="hero-title">CampusOra</h1>
            <p className="hero-quote">
              Find a place that feels like home, even away from home
            </p>
          </div>
        </div>
      </div>

      <section className="nearby-section">
        <h2>Rooms Near You</h2>

        {loading && <p className="no-rooms">Loading rooms...</p>}

        {!loading && rooms.length === 0 && (
          <p className="no-rooms">No rooms available right now</p>
        )}

        <div className="room-grid">
          {rooms.map((room) => (
            <div className="room-card" key={room._id}>
              <img
                src={
                  room.images?.length
                    ? room.images[0]
                    : "/placeholder-room.jpg"
                }
                alt="Room"
              />

              <div className="room-info">
                <h3>{room.title}</h3>
                <p className="price">₹{room.rent} / month</p>

                <button
                  onClick={() => navigate(`/room/${room._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;