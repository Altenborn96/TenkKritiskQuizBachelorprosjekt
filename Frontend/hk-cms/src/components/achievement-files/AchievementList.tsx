import React, { useEffect, useState } from "react";
import "../../css/Achievements.css";
import AddAchievement from "./AddAchievement.tsx";
import { get, del } from "../../services/Api.jsx";

type Achievement = {
  id: number;
  name: string;
  url: string;
  description: string;
  playerId?: string;
  sectionId?: number;
};

const AchievementList = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  //Henter alle achievementser under rendering, legger i listen achievements

  const getAchievements = async () => {
    const res = await get("/achievements");
    //console.log(JSON.stringify(res));

    const achievementsArray = res.$values || res;
    setAchievements(achievementsArray);
  };

  useEffect(() => {
    getAchievements();
  }, []);

  const handleDelete = async (id) => {
    try {
      await del(`/achievements/${id}`);

      console.log("ID til slettet: ", id);

      //Slette siste achievements for klient
      setAchievements((prevAchievements) =>
        prevAchievements.filter((a) => a.id !== id)
      );

      await getAchievements();
    } catch (error) {
      console.log("feilmelding: ", error);
    }
  };

  return (
    <div className="achievement-container">
      <div className="achievement-list-container">
        <h1 className="achievement-title">Oppnåelser</h1>
        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="achievement-item">
              <img
                src={achievement.url}
                alt={achievement.name}
                className="achievement-img"
              />
              <p className="achievement-name">{achievement.name}</p>
              <button
                className="delete-button"
                onClick={() => handleDelete(achievement.id)}
              >
                Slett
              </button>
            </div>
          ))}
        </div>
      </div>

      <AddAchievement onUpload={getAchievements} />
    </div>
  );
};

export default AchievementList;
