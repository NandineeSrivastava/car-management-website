import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CarCard from "./CarCard";
import Grid from "@mui/material/Grid2";
// import "./SearchResult.css";

const SearchResult = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `https://car-management-website-backend.onrender.com/cars/search?query=${query}`
        );
        if (response.ok) {
          const data = await response.json();
          setCars(data);
        } else {
          console.error("Error fetching search results:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div>
      <Navbar name="Search Results" />
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

export default SearchResult;
