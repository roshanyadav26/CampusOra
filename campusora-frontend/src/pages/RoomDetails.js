import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "./RoomDetails.css";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    api.get(`/api/rooms/${id}`)
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

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const lat = room.location?.coordinates?.[1];
  const lng = room.location?.coordinates?.[0];

  return (
    <div className="room-details-page">

      <div className="slider-container">

        <button className="arrow left" onClick={prevImage}>
          ❮
        </button>

        <img
          className="slider-main-image"
          src={images[currentIndex]}
          alt="room"
        />

        <button className="arrow right" onClick={nextImage}>
          ❯
        </button>

        <div className="thumbnails">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className={i === currentIndex ? "active-thumb" : ""}
              onClick={() => setCurrentIndex(i)}
              alt=""
            />
          ))}
        </div>
      </div>

      <div className="details-container">

        <div className="left-section">
          <h1>{room.title}</h1>
          <p className="price">₹{room.rent} / month</p>
          <p className="location">📍 {room.address}</p>
          <p>{room.description}</p>

          {lat && lng && (
            <GoogleMap
              center={{ lat: Number(lat), lng: Number(lng) }}
              zoom={15}
              mapContainerStyle={{
                width: "100%",
                height: "300px",
                borderRadius: "14px",
              }}
            >
              <Marker position={{ lat: Number(lat), lng: Number(lng) }} />
            </GoogleMap>
          )}
        </div>

      </div>
    </div>
  );
}

export default RoomDetails;