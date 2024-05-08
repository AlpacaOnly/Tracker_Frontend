import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Assuming Navbar is your navigation component

const NavLayout = () => (
  <>
    <Navbar />
    <Outlet />  // Child routes will render here
  </>
);

export default { NavLayout}