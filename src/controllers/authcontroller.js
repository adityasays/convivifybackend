// src/controllers/authController.js
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "quicktest123";

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ msg: "All fields required" });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password }); // ← password saved raw
    await user.save();

    const token = jwt.sign({ id: user.anonymousId }, JWT_SECRET, { expiresIn: "30d" });

    res.json({
      token,
      user: { anonymousId: user.anonymousId, conviScore: user.conviScore },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Email & password required" });

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.anonymousId }, JWT_SECRET, { expiresIn: "30d" });

    res.json({
      token,
      user: { anonymousId: user.anonymousId, conviScore: user.conviScore },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ anonymousId: req.userId });
    res.json({ anonymousId: user.anonymousId, conviScore: user.conviScore });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};