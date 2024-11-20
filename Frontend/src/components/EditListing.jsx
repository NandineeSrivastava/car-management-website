import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField, FormControlLabel, Checkbox } from "@mui/material";
import "./CreateListing.css";
import Navbar from "./Navbar";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(
          `https://car-management-website-backend.onrender.com/cars/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setCar(data);
          setTitle(data.title);
          setDescription(data.description);
          setTags(data.tags);
          setImages(data.images);
          setImagePreviews(
            data.images.map((image) =>
              typeof image === "string"
                ? `https://car-management-website-backend.onrender.com/${image}`
                : URL.createObjectURL(image)
            )
          );
        } else {
          console.error("Error fetching car:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!car) {
    return <div>Car not found</div>;
  }

  const availableTags = ["SUV", "Sedan", "Truck", "Convertible", "Coupe"];

  const handleTagChange = (event) => {
    const { value, checked } = event.target;
    setTags((prevTags) =>
      checked ? [...prevTags, value] : prevTags.filter((tag) => tag !== value)
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
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags.join(","));
    images.forEach((image) => formData.append("images", image));

    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
      const response = await fetch(
        `https://car-management-website-backend.onrender.com/cars/update/${id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (response.ok) {
        navigate("/your-listings");
      } else {
        console.error("Error updating car:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  return (
    <div>
      <Navbar name="Edit Listing" />
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div>
          {availableTags.map((tag) => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox
                  value={tag}
                  checked={tags.includes(tag)}
                  onChange={handleTagChange}
                />
              }
              label={tag}
            />
          ))}
        </div>
        <input type="file" multiple onChange={handleImageChange} />
        <p>{images.length} images selected</p>
        <div className="image-previews">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="image-preview">
              <img src={preview} alt="Preview" />
              <Button onClick={() => handleRemoveImage(index)}>Remove</Button>
            </div>
          ))}
        </div>
        <Button type="submit">Update Listing</Button>
      </form>
    </div>
  );
};

export default EditListing;
