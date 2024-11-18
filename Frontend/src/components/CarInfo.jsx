import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./CarInfo.css";

const CarInfo = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(
          `https://car-management-website-backend.onrender.com/cars/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setCar(data);
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <>
      <Navbar name="Car Info" />
      <div className="car-info">
        <Carousel className="carousel" infiniteLoop>
          {car.images.map((image, index) => (
            <div key={index}>
              <img
                src={`https://car-management-website-backend.onrender.com/${image}`}
                alt={`Car ${index}`}
              />
            </div>
          ))}
        </Carousel>
        <div className="text">
          <h2>{car.title}</h2>
          <p>{car.description}</p>
          <p>Tags: {car.tags.join(", ")}</p>
        </div>
      </div>
    </>
  );
};

export default CarInfo;
