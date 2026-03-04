import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import heroImage from "../assets/hero.png";
import "./Home.css";

/* ⭐ IMAGE FIX (supports old + cloudinary) */
const getImageUrl = (img) => {
  if (!img) return "/placeholder-room.jpg";
  if (img.startsWith("http")) return img;
  return `${process.env.REACT_APP_API_URL}/${img}`;
};

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
          fetchNearby(pos.coords.latitude, pos.coords.longitude),
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
            <h1 className="hero-title">Welcome to CampusOra</h1>
            <p className="hero-subtitle">
              Discover verified, affordable rooms near your college.
            </p>
            <button className="hero-cta" onClick={() => document.getElementById('rooms-section').scrollIntoView({ behavior: 'smooth' })}>
              Explore Rooms
            </button>
          </div>
        </div>
      </div>

      <section id="rooms-section" className="nearby-section">
        <h2>Rooms Near You</h2>
        <p className="nearby-subtitle">
          Affordable and verified rooms around your college
        </p>

        {loading && <p className="no-rooms">Loading rooms...</p>}

        {!loading && rooms.length === 0 && (
          <p className="no-rooms">No rooms available right now</p>
        )}

        <div className="room-grid">
          {rooms.map((room) => (
            <div className="room-card" key={room._id}>
              <div className="room-image-wrapper">
                {/* Fallback Badge overlay */}
                <div className="badge-top-left">New</div>
                <img
                  src={getImageUrl(room.images?.[0])}
                  alt="Room"
                  crossOrigin="anonymous"
                />
              </div>

              <div className="room-info">
                <div className="room-header">
                  <h3>{room.title}</h3>
                  <span className="badge-verified">✓ Verified</span>
                </div>

                <p className="location">
                  <span className="location-icon">📍</span> {room.address || "Near Campus"}
                </p>

                <div className="price-row">
                  <p className="price">
                    <span className="currency">₹</span>{room.rent} <span className="interval">/ month</span>
                  </p>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => navigate(`/room/${room._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ FLOATING CHAT BUTTON */}
      <div
        className="floating-chat-btn"
        onClick={() => navigate("/chat")}
      >
        💬
      </div>
    </>
  );
}

export default Home;