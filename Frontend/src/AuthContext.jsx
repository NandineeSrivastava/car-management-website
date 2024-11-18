import React, { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  //   const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const response = await fetch("http://localhost:8008/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            console.error("Error fetching user data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [refresh]);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8008/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { user, token } = await response.json();
        setUser(user);
        localStorage.setItem("jwtToken", token);
        console.log("login successful");
        // navigate("/"); // Navigate to home page upon successful login
      } else {
        console.error("Error logging in:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
    setRefresh(!refresh);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jwtToken");
    // navigate("/signin");
    setRefresh(!refresh);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
