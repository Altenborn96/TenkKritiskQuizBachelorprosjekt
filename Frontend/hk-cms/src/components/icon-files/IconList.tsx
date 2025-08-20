import React, { useEffect, useState } from "react";
import "../../css/Icon.css";
import AddIcon from "./AddIcon.tsx";
import { get, del } from "../../services/Api.jsx";

type Icon = {
  id: number;
  name: string;
  url: string;
  description: string;
  playerId?: string;
  sectionId?: number;
};

const IconList = () => {
  const [icons, setIcons] = useState<Icon[]>([]);

  //Henter alle iconser under rendering, legger i listen icons

  const getIcons = async () => {
    const res = await get("/icons");
    //console.log(JSON.stringify(res));

    const iconsArray = res.$values || res;
    setIcons(iconsArray);
  };

  useEffect(() => {
    getIcons();
  }, []);

  const handleDelete = async (id) => {
    try {
      await del(`/icons/${id}`);

      console.log("ID til slettet: ", id);

      //Slette siste icons for klient
      setIcons((prevIcons) => prevIcons.filter((a) => a.id !== id));

      await getIcons();
    } catch (error) {
      console.log("feilmelding: ", error);
    }
  };

  return (
    <div className="icon-container">
      <div className="icon-list-container">
        <h1 className="icon-title">Ikoner</h1>
        <div className="icon-grid">
          {icons.map((icon) => (
            <div key={icon.id} className="icon-item">
              <img src={icon.url} alt={icon.name} className="icon-img" />
              <p className="icon-name">{icon.name}</p>
              <button
                className="delete-button"
                onClick={() => handleDelete(icon.id)}
              >
                Slett
              </button>
            </div>
          ))}
        </div>
      </div>

      <AddIcon onUpload={getIcons} />
    </div>
  );
};

export default IconList;
