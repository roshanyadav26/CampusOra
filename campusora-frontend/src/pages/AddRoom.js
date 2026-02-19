import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationPicker from "../components/LocationPicker";
import "./AddRoom.css";

/* LEAFLET FIX */
import L from "leaflet";
import markerIcon from "../assets/leaflet/marker-icon.png";
import markerIcon2x from "../assets/leaflet/marker-icon-2x.png";
import markerShadow from "../assets/leaflet/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function AddRoom() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    rent: "",
    description: "",
  });

  const [amenities, setAmenities] = useState({
    electricity: false,
    waterSupply: false,
    hospitalNearby: false,
    parkNearby: false,
    templeNearby: false,
    furnished: false,
    wifi: false,
    parking: false,
    attachedBathroom: false,
  });

  const [images, setImages] = useState([]);
  const [locationData, setLocationData] = useState({
    lat: null,
    lng: null,
    location: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* HANDLE TEXT INPUT */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* HANDLE AMENITIES */
  const handleAmenityChange = (e) => {
    setAmenities({
      ...amenities,
      [e.target.name]: e.target.checked,
    });
  };

  /* HANDLE IMAGES */
  const handleImageChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    setImages(e.target.files);  // keep as FileList
  }
};


  /* HANDLE SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.rent || !formData.description) {
      return setError("Please fill all required fields");
    }

    if (!locationData.lat || !locationData.lng) {
      return setError("Please select the room location");
    }

    if (images.length === 0) {
      return setError("Upload at least one image");
    }

    setLoading(true);
    setError("");

    const data = new FormData();

    data.append("title", formData.title);
    data.append("rent", formData.rent);
    data.append("description", formData.description);
    data.append("location", locationData.location);
    data.append("lat", locationData.lat);
    data.append("lng", locationData.lng);

    // Send amenities as JSON object
    data.append("amenities", JSON.stringify(amenities));

    // Append multiple images
   Array.from(images).forEach((image) => {
  data.append("images", image);
});


    try {
      await axios.post("http://localhost:5000/api/rooms", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Room added successfully ✅");
      navigate("/rooms");

    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addroom-page">
      <div className="addroom-card">
        <h2>Add Room Details</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Room Title *"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            type="number"
            name="rent"
            placeholder="Monthly Rent (₹) *"
            value={formData.rent}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Room Description *"
            value={formData.description}
            onChange={handleChange}
          />

          <h4>Room Amenities</h4>
          <div className="amenities-grid">
            {Object.keys(amenities).map((key) => (
              <label key={key} className="amenity-item">
                <input
                  type="checkbox"
                  name={key}
                  checked={amenities[key]}
                  onChange={handleAmenityChange}
                />
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
            ))}
          </div>

          <h4>Select Room Location</h4>
          <LocationPicker setLocationData={setLocationData} />

          <p className="selected-location">
            📍 {locationData.location || "Move pin to set location"}
          </p>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRoom;
