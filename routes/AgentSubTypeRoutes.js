const express = require("express");
const router = express.Router();
const AgentSubType = require("../models/AgentSubType");

// Get all or by name
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};
    if (name) query.name = name;

    const subtypes = await AgentSubType.find(query);
    if (!subtypes || subtypes.length === 0) {
      return res.status(404).json({ error: "Agent SubType not found" });
    }

    res.json(subtypes);
  } catch (err) {
    console.error("Error fetching AgentSubTypes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add new
router.post("/", async (req, res) => {
  try {
    const { name, description, commissionRate } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const existing = await AgentSubType.findOne({ name });
    if (existing) return res.status(400).json({ error: "Subtype already exists" });

    const newSubType = new AgentSubType({ name, description, commissionRate });
    await newSubType.save();

    res.status(201).json(newSubType);
  } catch (err) {
    console.error("Error creating AgentSubType:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;