// src/models/User.js  ← FINAL FIXED VERSION (copy-paste this)
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    anonymousId: {
      type: String,
      unique: true,
      default: () => "user_" + Math.random().toString(36).substr(2, 9),
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,        // ← MongoDB will create proper unique index on email
      lowercase: true,     // ← prevents case-sensitive duplicates
      trim: true, 
    },
    password: { type: String, required: true },

    // CONVI SYSTEM
    conviScore: { type: Number, default: 0 },
    conviHistory: [
      {
        score: { type: Number, required: true },
        level: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    nextAssessmentDate: { type: Date }, // null = can take now
    assessmentCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false, // we already have createdAt
  }
);

// THIS IS THE KEY LINE — removes any old broken indexes on startup
UserSchema.pre("save", async function (next) {
  try {
    // Drop old problematic emailHash index if it exists
    await this.collection.dropIndex("emailHash_1").catch(() => {});
    next();
  } catch (err) {
    next(); // ignore if index doesn't exist
  }
});

module.exports = mongoose.model("User", UserSchema);