// src/services/PlayerServices.js

const baseURL = "https://tenk-kritisk.no/api";

// Helper function for GET requests
export const get = async (endpoint) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`GET request failed: ${response.status}`);
    }
    const jsonResponse = await response.json();
    return jsonResponse.$values || jsonResponse; // Check for $values if present
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error.message);
    throw error;
  }
};

// Helper function for POST requests
export const post = async (endpoint, body) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`POST request failed for ${endpoint}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error.message);
    throw error;
  }
};

// Helper function for DELETE requests
export const del = async (endpoint) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`DELETE request failed for ${endpoint}`);
    }

    if (response.status === 204) {
      return; // No content, return nothing
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error.message);
    throw error;
  }
};

// Fetch all players
export const getPlayers = async () => {
  return await get("/cmsplayers"); // Specify the players endpoint
};

// Delete a player
export const deletePlayer = async (playerId) => {
  return await del(`/cmsplayers/${playerId}`); // Specify the player ID endpoint
};

// Add a new player
export const createPlayer = async (body) => {
  return await post("/cmsplayers", body); // Specify the players endpoint and pass the body
};
