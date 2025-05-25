const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Event
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, date, location, image } = req.body;
    if (!title || !date || !image) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const existingEvent = await Event.findOne({
      title,
      date,
      location,
      createdBy: req.user.id,
    })
    
    if(existingEvent){
      return res
      .status(400)
      .json({
        msg: "You have already created an event with the same title, date, and location."
      })
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      image,
      createdBy: req.user.id,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// Get All Events (both approved and pending)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch events" });
  }
});

// Admin Approve Event
router.put("/:id/approve", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to approve event" });
  }
});

// Update Event (admin OR owner)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    const isOwner = event.createdBy.toString() === req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin)
      return res.status(401).json({ msg: "Unauthorized" });

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update event" });
  }
});

// Delete Event (admin OR creator)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    const user = await User.findById(req.user.id);

    if (event.createdBy.toString() !== req.user.id && user.role !== "admin") {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete event" });
  }
});

// RSVP to Event
router.post("/:id/rsvp", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (!event.rsvpUsers.includes(req.user.id)) {
      event.rsvpUsers.push(req.user.id);
      await event.save();
    }

    res.json({ msg: "RSVP added", rsvpCount: event.rsvpUsers.length });
  } catch (err) {
    res.status(500).json({ msg: "Failed to RSVP", error: err.message });
  }
});

// Cancel RSVP
router.delete("/:id/rsvp", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    event.rsvpUsers = event.rsvpUsers.filter(
      (userId) => userId.toString() !== req.user.id
    );
    await event.save();

    res.json({ msg: "RSVP removed", rsvpCount: event.rsvpUsers.length });
  } catch (err) {
    res.status(500).json({ msg: "Failed to cancel RSVP", error: err.message });
  }
});

module.exports = router;
