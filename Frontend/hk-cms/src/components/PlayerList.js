import React, { useState, useEffect } from "react";
import { deletePlayer, getPlayers } from "../services/PlayerService";
import AddPlayer from "./AddPlayer";
import "./../css/PlayerList.css";

const PlayerList = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersData = await getPlayers();
        const playerArray = playersData?.$values || playersData || []; // Handle $values or undefined
        setPlayers(playerArray);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  const handleDelete = async (playerId) => {
    try {
      const isDeleted = await deletePlayer(playerId);
      if (isDeleted) {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
      }
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const handlePlayerAdded = (newPlayer) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
  };

  return (
    <div className="player-list-container">
      <h2>Player List</h2>
      <AddPlayer onPlayerAdded={handlePlayerAdded} />
      {!players || players.length === 0 ? (
        <p>Loading or no players available.</p>
      ) : (
        <ul>
          {players
            .sort((a, b) => a.userName.localeCompare(b.userName)) // Sort players by username
            .map((player) => (
              <li key={player.id}>
                {player.userName}
                <button className="delete-player-button" onClick={() => handleDelete(player.id)}>Delete</button>

              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerList;
