import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import CarCard from "./CarCard";
import Grid from "@mui/material/Grid2";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [cars, setCars] = useState([]);

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

    const intervalId = setInterval(fetchCars, 30000); // Fetch cars every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <Navbar name="Home" />
      <Grid container spacing={2} className="list">
        {cars.map((car, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <CarCard car={car} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
