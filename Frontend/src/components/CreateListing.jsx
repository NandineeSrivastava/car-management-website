import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, FormControlLabel, Checkbox } from "@mui/material";
import "./CreateListing.css";
import Navbar from "./Navbar";

const CreateListing = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();

  const availableTags = ["SUV", "Sedan", "Truck", "Convertible", "Coupe"];

  const handleTagChange = (event) => {
    const value = event.target.value;
    setTags(
      tags.includes(value)
        ? tags.filter((tag) => tag !== value)
        : [...tags, value]
    );
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    console.log("Files selected:", files);
    setImages((prevImages) => [...prevImages, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("jwtToken");

    const formData = new FormData();
    formData.append("title", name);
    formData.append("description", description);
    tags.forEach((tag) => formData.append("tags", tag));
    images.forEach((image) => formData.append("images", image));
    try {
      const response = await fetch(
        "https://car-management-website-backend.onrender.com/cars/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Note: No "Content-Type" for FormData
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create listing");
      }
      navigate("/"); // Redirect after successful submission
    } catch (error) {
      console.error("Error creating car:", error);
    }
  };

  return (
    <>
      <Navbar name="Create Listing" />
      <form onSubmit={handleSubmit}>
        <TextField
          label="Car Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          multiline
        />
        <div>
          {availableTags.map((tag) => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox
                  checked={tags.includes(tag)}
                  onChange={handleTagChange}
                  value={tag}
                />
              }
              label={tag}
            />
          ))}
        </div>
        <div>
          <label>Upload Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <p>{images.length} images selected</p>
        </div>
        <div className="image-previews">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="image-preview">
              <img src={preview} alt={`Preview ${index}`} />
              <button type="button" onClick={() => handleRemoveImage(index)}>
                &times;
              </button>
            </div>
          ))}
        </div>
        <Button type="submit">Create Listing</Button>
      </form>
    </>
  );
};

export default CreateListing;
