const express = require("express");
// const upload = require('../middleware/upload'); // Ensure this is correctly configured
const Car = require("../models/Car");
const authMiddleware = require("../middleware/auth"); // Ensure you have the auth middleware
const router = express.Router();
const fs = require("fs"); // For filesystem operations if needed
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `images-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Create a car
router.post(
  "/add",
  authMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      const userId = req.user.id;

      console.log("Uploaded files:", req.files); // Log uploaded files for debugging

      // Ensure uploaded files are handled
      // Normalize file paths for web compatibility
      const imagePaths = req.files
        ? req.files.map((file) => file.path.replace(/\\/g, "/"))
        : [];

      // Ensure tags is an array
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",");

      const car = new Car({
        title,
        description,
        tags: tagsArray,
        images: imagePaths,
        user: userId,
      });
      await car.save();
      res.status(201).json({ car });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Fetch all cars
router.get("/all", async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Upload files
router.post("/upload", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const imagePaths = req.files.map((file) =>
      path.relative("uploads", file.path)
    );
    console.log("Uploaded files:", imagePaths); // Log uploaded files for debugging
    res
      .status(200)
      .json({ message: "Files uploaded successfully", files: imagePaths });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Search cars
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const searchCriteria = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    };
    const cars = await Car.find(searchCriteria);
    res.status(200).json(cars);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.status(200).json(car);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update car
router.put("/update/:id", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const imagePaths = req.files
      ? req.files.map((file) => `uploads/${file.filename}`)
      : [];

    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    // Fetch the existing car data
    const existingCar = await Car.findById(id);
    if (!existingCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Update the specified fields
    existingCar.title = title || existingCar.title;
    existingCar.description = description || existingCar.description;
    existingCar.tags = typeof tags === 'string' ? tags.split(",") : existingCar.tags;
    if (imagePaths.length > 0) {
      existingCar.images = imagePaths;
    }

    // Save the updated car data
    const updatedCar = await existingCar.save();
    res.status(200).json(updatedCar);
  } catch (err) {
    console.error("Error updating car:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete car
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
