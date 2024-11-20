import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import CarInfo from "./components/CarInfo";
import CreateListing from "./components/CreateListing";
import YourListings from "./components/YourListings";
import EditListing from "./components/EditListing";
import { useParams } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import SearchResult from "./components/SearchResult";

function App() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("https://car-management-website-backend.onrender.com/cars/all")
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);

  const updateCars = (updatedCar) => {
    setCars((prevCars) =>
      prevCars.map((car) => (car._id === updatedCar._id ? updatedCar : car))
    );
  };

  const addCar = (newCar) => {
    setCars((prevCars) => [...prevCars, newCar]);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/car/:id" element={<CarInfo />} />
          <Route
            path="/create-listing"
            element={
              <PrivateRoute>
                <CreateListing addCar={addCar} />
              </PrivateRoute>
            }
          />
          <Route
            path="/your-listings"
            element={
              <PrivateRoute>
                <YourListings />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-listing/:id"
            element={
              <PrivateRoute>
                <EditListing />
              </PrivateRoute>
            }
          />
          <Route path="/searchresult" element={<SearchResult />} />
          <Route path="/api/docs" element={<div></div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
