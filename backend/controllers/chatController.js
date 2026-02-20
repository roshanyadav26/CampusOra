const Room = require("../models/Room");
/* =========================
   ADD ROOM
========================= */
exports.addRoom = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      deposit,
      genderPreference,
      sharingType,
      furnished,
      lat,
      lng,
    } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Location (lat & lng) is required",
      });
    }

    const imagePaths = req.files
      ? req.files.map((file) => file.path)
      : [];

    const newRoom = new Room({
      title,
      description,
      rent,
      deposit,
      genderPreference,
      sharingType,
      furnished,
      images: imagePaths,
      owner: req.user.id, // from protect middleware
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding room" });
  }
};

/* =========================
   GET ALL ROOMS
========================= */
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

/* =========================
   GET ROOM BY ID
========================= */
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room" });
  }
};

/* =========================
   GET NEARBY ROOMS (3KM)
========================= */
exports.getNearbyRooms = async (req, res) => {
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
          $maxDistance: 3000, // 3km
        },
      },
    }).populate("owner", "name email");

    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching nearby rooms" });
  }
};
