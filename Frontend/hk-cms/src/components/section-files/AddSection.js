import React, {  useState, useEffect } from "react";
import { post, get } from "../../services/Api"; // Adjust the import according to your project structure
import "../../css/Section.css";

const AddSection = ({ triggerFetch }) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [points, setPoints] = useState("");
    const [locked, setLocked] = useState(false);
    const [achievements, setAchievements] = useState([])
    const [achievementId, setAchievementId] = useState(0)
    const [image, setImage] = useState("")
    const [icons, setIcons] = useState([]);
    const [iconId, setIconId] = useState(0)
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "") {
            setError("Section name is required.");
            return;
        }

        try {

            await post("/section", { name, description, image: "", points, locked, image, achievementId }); 
            setName(""); 
            setPoints("");
            setAchievementId(null);
            setImage(null);
            setLocked(false);
            setImage("");
            setDescription("");

            triggerFetch();
        } catch (error) {
            setError("Error creating section.");
            console.error("There was an error creating the section!", error);
        }
    };

        //fetch achievements
        useEffect(() => {
    
                const getAchievements = async (id) => {
                    const res = await get("/achievements");
    
                    const achievementsArray = res.$values || res;
                    setAchievements(achievementsArray);
                    console.log("achievements: ",achievementsArray)
              };
              getAchievements();
    
        }, [])

        //fetch avatars (placeholder for actual section icons later on)
        useEffect(() => {
    
            const getIcons = async (id) => {
                const res = await get("/icons");

                const iconsArray = res.$values || res;
                setIcons(iconsArray);
                console.log("icons: ",iconsArray)
          };
          getIcons();

    }, [])

    //Handle both set states on selecting icon
    const handleIconSelect = (id, url) => {
        setIconId(id)
        setImage(url)
    } 


    return (
        <div className="add-section-container">
            <h2>Lag en ny modul</h2>
            <form onSubmit={handleSubmit} className="section-form">
                <div>
                    <label>Modul tittel : </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Skriv in tittel på modul"
                    />
                </div>

                <div>
                    <label>Poeng : </label>
                    <input
                        type="text"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        placeholder="Skriv inn poengsum"
                    />
                </div>
                <div>
                    <label>Forklaring av modul : </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Skriv inn forklaring (valgfritt)"
                    />
                </div>

                {/* Checkbox for locked or unlocked section */}
                <label>Sett modul som låst</label>
                <input
                    type="checkbox"
                    checked={locked}
                    onChange={(e) => setLocked(e.target.checked)}
                    
                />

                {/* Choose section icon (currently using avatar icons) */}
                <label>Velg ikon for modul</label>
                <div className="achievement-grid">

                {icons.map((icon) => (
                    <div key={icon.id} className="achievement-item">
                        <img
                            src={icon.url}
                            alt={icon.name}
                            className={`achievement-item-sectionlist ${iconId === icon.id ? "selected" : ""}`}
                            onClick={() => handleIconSelect(icon.id, icon.url)}
                        />                         

                    </div>
                ))}
                </div>


                {/* Choose section achievement */}
                <label>Velg achievement for modul</label>
                <div className="achievement-grid">

                {achievements.map((achievement) => (
                    <div key={achievement.id} className="achievement-item">
                        <img
                            src={achievement.url}
                            alt={achievement.name}
                            className={`achievement-item-sectionlist ${achievementId === achievement.id ? "selected" : ""}`}
                            onClick={() => setAchievementId(achievement.id)}
                        />                         

                    </div>
                ))}
                </div>


                {error && <p className="error-message">{error}</p>}
                <button type="submit">Lag modul</button>
            </form>
        </div>
    );
};

export default AddSection;

