import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log(user);

  return user ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
