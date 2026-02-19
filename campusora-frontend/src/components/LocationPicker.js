import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

/* ================= MARKER HANDLER ================= */
function LocationMarker({ position, setPosition, setLocationData }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      await fetchAddress(lat, lng);
    }
  });

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat,
            lon: lng,
            format: "json"
          }
        }
      );

      setLocationData({
        lat,
        lng,
        location: res.data.display_name
      });
    } catch (err) {
      console.log("Reverse geocoding failed");
    }
  };

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: async (e) => {
          const { lat, lng } = e.target.getLatLng();
          setPosition([lat, lng]);
          await fetchAddress(lat, lng);
        }
      }}
    />
  );
}

/* ================= MAIN COMPONENT ================= */
function LocationPicker({ setLocationData }) {
  const [position, setPosition] = useState([18.5204, 73.8567]);
  const [manualAddress, setManualAddress] = useState("");

  /* ---------- Detect Current Location ---------- */
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);

        try {
          const res = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: { lat, lon: lng, format: "json" }
            }
          );

          setLocationData({
            lat,
            lng,
            location: res.data.display_name
          });

          setManualAddress(res.data.display_name);
        } catch (err) {
          console.log("Failed to fetch address");
        }
      },
      () => alert("Location permission denied")
    );
  };

  /* ---------- Manual Address Search ---------- */
  const handleManualSearch = async () => {
    if (!manualAddress) {
      alert("Please enter an address");
      return;
    }

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: manualAddress,
            format: "json"
          }
        }
      );

      if (res.data.length === 0) {
        alert("Address not found");
        return;
      }

      const lat = parseFloat(res.data[0].lat);
      const lng = parseFloat(res.data[0].lon);

      setPosition([lat, lng]);

      setLocationData({
        lat,
        lng,
        location: res.data[0].display_name
      });
    } catch (err) {
      alert("Failed to search address");
    }
  };

  return (
    <>
      {/* 🔎 Manual Address Input */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter address manually..."
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          style={{
            width: "70%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <button
          type="button"
          onClick={handleManualSearch}
          style={{
            marginLeft: "8px",
            padding: "8px 12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>

      {/* 📍 Detect Current Location */}
      <button
        type="button"
        onClick={detectCurrentLocation}
        style={{
          marginBottom: "10px",
          padding: "8px 12px",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        📍 Use My Current Location
      </button>

      {/* 🗺 Map */}
      <MapContainer
        center={position}
        zoom={15}
        style={{
          height: "300px",
          width: "100%",
          borderRadius: "10px"
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          setLocationData={setLocationData}
        />
      </MapContainer>
    </>
  );
}

export default LocationPicker;
