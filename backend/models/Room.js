const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,
    bhk: {
  type: Number,
  required: true,
},

    rent: {
      type: Number,
      required: true,
    },

    deposit: Number,
    genderPreference: String,
    sharingType: String,
    furnished: Boolean,

    images: [String],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ ADD THIS (You were missing it)
    address: {
      type: String,
    },

    // ✅ ADD THIS (MAIN FIX)
    amenities: {
      type: Object,
      default: {},
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

// 🔥 Important for geospatial queries
roomSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Room", roomSchema);
