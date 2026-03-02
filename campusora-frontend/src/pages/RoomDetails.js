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
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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

  return (
    <div className="room-details-page">

      <div className="slider-container">

        <button
          className="arrow left"
          onClick={() =>
            setCurrentIndex(
              currentIndex === 0
                ? images.length - 1
                : currentIndex - 1
            )
          }
        >
          ❮
        </button>

        <img
          className="slider-main-image"
          src={`${process.env.REACT_APP_API_URL}/${images[currentIndex]}`}
          alt=""
        />

        <button
          className="arrow right"
          onClick={() =>
            setCurrentIndex(
              (currentIndex + 1) % images.length
            )
          }
        >
          ❯
        </button>

        <div className="thumbnails">
          {images.map((img, i) => (
            <img
              key={i}
              src={`${process.env.REACT_APP_API_URL}/${img}`}
              className={i === currentIndex ? "active-thumb" : ""}
              onClick={() => setCurrentIndex(i)}
              alt=""
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default RoomDetails;