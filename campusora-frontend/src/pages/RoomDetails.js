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

  const images = room.images || [];
  const lat = room.location?.coordinates?.[1];
  const lng = room.location?.coordinates?.[0];

  const isOwner = currentUser?._id === room.owner?._id;
  const isStudent = currentUser?.role === "student";

  return (
    <div className="room-details-page">

      {/* ===== IMAGE GALLERY ===== */}
      <div className="gallery">
        <img
          className="main-image"
          src={`http://localhost:5000/${images[0]}`}
          alt=""
        />

        <div className="side-images">
          {images.slice(1,3).map((img, i) => (
            <img
              key={i}
              src={`http://localhost:5000/${img}`}
              alt=""
            />
          ))}
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="details-container">

        {/* LEFT */}
        <div className="left-section">
          <h1>{room.title}</h1>

          <p className="price">₹{room.rent} / month</p>

          <p className="location">
            📍 {room.address}
          </p>

          <p className="description">{room.description}</p>

          <h3>Room Amenities</h3>

          <div className="amenities">
            {room.amenities &&
              Object.entries(room.amenities)
                .filter(([_, v]) => v)
                .map(([key]) => (
                  <span key={key}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                  </span>
                ))}
          </div>

          {/* MAP */}
          {lat && lng && (
            <GoogleMap
              center={{ lat: Number(lat), lng: Number(lng) }}
              zoom={15}
              mapContainerStyle={{
                width: "100%",
                height: "300px",
                marginTop: "25px",
                borderRadius: "14px",
              }}
            >
              <Marker position={{ lat: Number(lat), lng: Number(lng) }} />
            </GoogleMap>
          )}
        </div>

        {/* RIGHT CARD */}
        <div className="right-section">
          <h3>Owner Details</h3>

          <p><strong>Name:</strong> {room.owner?.name}</p>
          <p><strong>Phone:</strong> {room.owner?.phone}</p>

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
        directOpen: true,
      },
    })
  }
>
  💬 Chat With Owner
</button>

          )}

          <div className="owner-actions">
            <a href={`tel:${room.owner?.phone}`}>📞 Call</a>
            <a
              href={`https://wa.me/91${room.owner?.phone}`}
              target="_blank"
              rel="noreferrer"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RoomDetails;
