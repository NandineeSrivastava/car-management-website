import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import TemporaryDrawer from "./TemporaryDrawer";
// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

const Navbar = ({ name }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  let { user, logout } = useContext(AuthContext);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/searchresult?query=${searchQuery}`);
  };

  const handleLoginClick = () => {
    navigate("/signin");
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/signin");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, ml: 1, padding: 0 }}
          >
            <TemporaryDrawer />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {name}
          </Typography>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search cars"
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "white", borderRadius: 1, mr: 2 }}
            />
            <Button type="submit" color="inherit">
              Search
            </Button>
          </form>
          {user ? (
            <Button onClick={handleLogoutClick} color="inherit">
              Logout
            </Button>
          ) : (
            <Button onClick={handleLoginClick} color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
