import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "./RoomDetails.css";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/rooms/${id}`)
      .then((res) => {
        setRoom(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading room...</p>;
  if (!room) return <p>Room not found</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  const lat = room.location?.coordinates?.[1];
  const lng = room.location?.coordinates?.[0];

  const isOwner = currentUser?._id === room.owner?._id;
  const isStudent = currentUser?.role === "student";

  return (
    <div className="room-details-page">
      
      {/* ================= IMAGE GALLERY ================= */}
      <div className="room-gallery">
        {room.images?.length > 0 ? (
          room.images.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
              alt="Room"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className="room-details-card">
        <h1>{room.title}</h1>
        <p className="price">₹{room.rent} / month</p>

        {/* ✅ Show Address Instead of Coordinates */}
        <p>
          <strong>Location:</strong>{" "}
          {room.address || "Location not available"}
        </p>

        <p>{room.description}</p>

        {/* ================= CHAT BUTTON ================= */}
        {currentUser && isStudent && !isOwner && (
          <button
            className="chat-btn"
            onClick={() =>
              navigate("/chat", {
                state: {
                  roomId: room._id,
                  ownerId: room.owner._id,
                  ownerName: room.owner.name,
                  roomTitle: room.title,
                },
              })
            }
          >
            💬 Chat With Owner
          </button>
        )}

        {/* ================= AMENITIES ================= */}
        <h3>Room Amenities</h3>

        {room.amenities &&
        Object.values(room.amenities).some((value) => value === true) ? (
          <div className="amenities-list">
            {Object.entries(room.amenities)
              .filter(([_, value]) => value === true)
              .map(([key]) => (
                <span key={key} className="amenity-badge">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </span>
              ))}
          </div>
        ) : (
          <p>No amenities listed</p>
        )}

        {/* ================= OWNER DETAILS ================= */}
        <div className="owner-card">
          <h3>Owner Details</h3>
          <p><strong>Name:</strong> {room.owner?.name}</p>
          <p><strong>Phone:</strong> {room.owner?.phone || "Not available"}</p>

          {currentUser && isStudent && !isOwner && room.owner?.phone && (
            <div className="owner-actions">
              <a href={`tel:${room.owner.phone}`}>📞 Call</a>
              <a
                href={`https://wa.me/91${room.owner.phone}`}
                target="_blank"
                rel="noreferrer"
              >
                💬 WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* ================= GOOGLE MAP ================= */}
        {lat && lng && (
          <GoogleMap
            center={{ lat: Number(lat), lng: Number(lng) }}
            zoom={15}
            mapContainerStyle={{ height: "300px", width: "100%", marginTop: "20px" }}
          >
            <Marker position={{ lat: Number(lat), lng: Number(lng) }} />
          </GoogleMap>
        )}
      </div>
    </div>
  );
}

export default RoomDetails;
