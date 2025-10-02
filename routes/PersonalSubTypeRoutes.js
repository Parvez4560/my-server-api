const express = require("express");
const router = express.Router();
const PersonalSubType = require("../models/PersonalSubType");

// Get all or by name
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};
    if (name) query.name = name;

    const subtypes = await PersonalSubType.find(query);
    if (!subtypes || subtypes.length === 0) {
      return res.status(404).json({ error: "Personal SubType not found" });
    }

    res.json(subtypes);
  } catch (err) {
    console.error("Error fetching PersonalSubTypes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add new
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const existing = await PersonalSubType.findOne({ name });
    if (existing) return res.status(400).json({ error: "Subtype already exists" });

    const newSubType = new PersonalSubType({ name, description });
    await newSubType.save();

    res.status(201).json(newSubType);
  } catch (err) {
    console.error("Error creating PersonalSubType:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;