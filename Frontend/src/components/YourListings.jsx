import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "./CarCard";
import Grid from "@mui/material/Grid2";
import Navbar from "./Navbar";
import { AuthContext } from "../AuthContext";

const YourListings = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:8008/cars/all");
        if (response.ok) {
          const data = await response.json();
          setCars(data);
        } else {
          console.error("Error fetching cars:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-listing/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8008/cars/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCars((prevCars) => prevCars.filter((car) => car._id !== id));
      } else {
        console.error("Error deleting car:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const userCars = cars.filter((car) => car.user === user._id);

  return (
    <div>
      <Navbar name="Your Listings" />
      <Grid container spacing={2} className="list">
        {userCars.map((car, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <CarCard
              car={car}
              isEditable={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default YourListings;
