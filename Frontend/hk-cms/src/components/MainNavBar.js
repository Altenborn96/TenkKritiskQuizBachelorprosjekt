// src/components/MainNavBar.js
import React from "react";
import { Link } from "react-router-dom";
import "./../css/NavBar.css";

const MainNavBar = () => {
  
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/privacy">Privacy Policy</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
        <li>
            <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavBar;
