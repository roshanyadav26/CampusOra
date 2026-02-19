const Room = require("../models/Room");

/* =========================
   ADD ROOM
========================= */
const addRoom = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      lat,
      lng,
      location,
      amenities,
    } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and Longitude required",
      });
    }

    const imagePaths = req.files
      ? req.files.map((file) => file.path)
      : [];

    // 🔥 VERY IMPORTANT: parse amenities safely
    let parsedAmenities = {};
    if (amenities) {
      try {
        parsedAmenities =
          typeof amenities === "string"
            ? JSON.parse(amenities)
            : amenities;
      } catch (err) {
        parsedAmenities = {};
      }
    }

    const newRoom = new Room({
      title,
      description,
      rent,
      images: imagePaths,
      owner: req.user._id,

      // ✅ Save readable location
      address: location || "",

      // ✅ Save amenities correctly
      amenities: parsedAmenities,

      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);

  } catch (error) {
    console.error("ADD ROOM ERROR:", error);
    res.status(500).json({ message: "Error adding room" });
  }
};


/* =========================
   GET ALL ROOMS
========================= */
const getRooms = async (req, res) => {
  try {
    const {
      minRent,
      maxRent,
      genderPreference,
      sharingType,
      furnished,
    } = req.query;

    let filter = {};

    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    if (genderPreference) {
      filter.genderPreference = genderPreference;
    }

    if (sharingType) {
      filter.sharingType = sharingType;
    }

    if (furnished !== undefined) {
      filter.furnished = furnished === "true";
    }

    const rooms = await Room.find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    console.error("GET ROOMS ERROR:", error);
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

/* =========================
   GET ROOM BY ID
========================= */
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    console.error("GET ROOM BY ID ERROR:", error);
    res.status(500).json({ message: "Error fetching room" });
  }
};

/* =========================
   GET NEARBY ROOMS
========================= */
const getNearbyRooms = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and Longitude required",
      });
    }

    const rooms = await Room.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 3000,
        },
      },
    }).populate("owner", "name email phone");

    res.json(rooms);
  } catch (error) {
    console.error("NEARBY ROOMS ERROR:", error);
    res.status(500).json({ message: "Error fetching nearby rooms" });
  }
};

/* =========================
   GET MY ROOMS
========================= */
const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user._id })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    console.error("GET MY ROOMS ERROR:", error);
    res.status(500).json({ message: "Error fetching your rooms" });
  }
};

/* =========================
   DELETE ROOM
========================= */
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await room.deleteOne();

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("DELETE ROOM ERROR:", error);
    res.status(500).json({ message: "Error deleting room" });
  }
};

module.exports = {
  addRoom,
  getRooms,
  getRoomById,
  getNearbyRooms,
  getMyRooms,
  deleteRoom,
};
