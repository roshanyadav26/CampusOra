import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Home.css";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async (lat, lng) => {
      try {
        const res = await api.get(
          "/api/rooms/nearby",
          {
            params: { lat, lng }
          }
        );
        setRooms(res.data);
      } catch (err) {
        console.error("Nearby fetch failed, loading featured rooms");
        const fallback = await api.get(
          "/api/rooms/featured"
        );
        setRooms(fallback.data);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          fetchRooms(
            pos.coords.latitude,
            pos.coords.longitude
          ),
        () => {
          // Permission denied → fallback
          fetchRooms();
        }
      );
    } else {
      fetchRooms();
    }
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <div
        className="hero"
style={{ backgroundImage: "url('/hero.png')" }}      >
        <div className="hero-overlay">
          <div className="hero-center">
            <h1 className="hero-title">CampusOra</h1>
            <p className="hero-quote">
              Find a place that feels like home, even away from home
            </p>
          </div>
        </div>
      </div>

      {/* ROOMS NEAR YOU */}
      <section className="nearby-section">
        <h2>Rooms Near You</h2>
        <p className="nearby-subtitle">
          Affordable and verified rooms around your college
        </p>

        {loading && (
          <p className="no-rooms">Loading rooms...</p>
        )}

        {!loading && rooms.length === 0 && (
          <p className="no-rooms">
            No rooms available right now
          </p>
        )}

        <div className="room-grid">
          {rooms.map((room) => (
            <div className="room-card" key={room._id}>
              <img
                src={
                  room.images?.length
                    ? `${process.env.REACT_APP_API_URL}/${room.images[0]}`
                    : "/placeholder-room.jpg"
                }
                alt="Room"
              />

              <div className="room-info">
                <h3>{room.title}</h3>
                <p className="price">
                  ₹{room.rent} / month
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
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;