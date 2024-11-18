import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import "./CarCard.css"; // Add CSS for hover effect

const CarCard = ({ car, isEditable, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    navigate(`/car/${car._id}`);
  };

  const imageUrl =
    car.images.length > 0
      ? `https://car-management-website-backend.onrender.com/${car.images[0]}`
      : "default-image-url";

  return (
    <Card
      sx={{ maxWidth: 345 }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative" }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={imageUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {car.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {car.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tags: {car.tags.join(", ")}
          </Typography>
          {hovered && isEditable && (
            <div className="hover-buttons">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(car._id);
                }}
              >
                Edit
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(car._id);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CarCard;
