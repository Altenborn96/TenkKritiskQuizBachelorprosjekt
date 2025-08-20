// src/components/AddPlayer.js

import React, { useState } from "react";
import { createPlayer } from "../services/PlayerService"; // Updated import
import "./../css/AddPlayer.css";

const AddPlayer = ({ onPlayerAdded }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlayer = await createPlayer(formData); // Create player using the updated service
    if (newPlayer) {
      setMessage("Player added successfully!");
      setFormData({ userName: "", email: "", password: "" });
      onPlayerAdded(newPlayer); // Notify parent component to refresh list
    } else {
      setMessage("Failed to add player. Please try again.");
    }
  };

  return (
    <div className="add-player-container">
      <h2>Add Player</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="add-player-button" type="submit">Add Player</button>

      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddPlayer;
