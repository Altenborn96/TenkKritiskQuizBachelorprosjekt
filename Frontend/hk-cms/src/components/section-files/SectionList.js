import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get, put, del } from "../../services/Api"; // Import your API methods
import "../../css/Section.css";


const SectionList = ({ fetchSections }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editedSectionName, setEditedSectionName] = useState("");
    const [editedPoints, setEditedPoints] = useState(null)
    const [locked, setLocked] = useState("")
    const [achievementId, setAchievementId] = useState(0);
    const [achievements, setAchievements] = useState([]);
    const [icons, setIcons] = useState([]);
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [editedDescription, setEditedDescription] = useState("")

    useEffect(() => {
        const fetchSectionsData = async () => {
            try {
                const data = await get("/section"); 
                setSections(data.$values || data);
            } catch (error) {
                console.error("Error fetching sections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSectionsData();
    }, [fetchSections]); // Fetch sections whenever fetchSections changes

    const handleDelete = async (id) => {
        try {
            await del(`/section/${id}`); 
            setSections(sections.filter((section) => section.id !== id));
        } catch (error) {
            console.error("Error deleting section:", error);
        }
    };

    /* Default values pre-editing */
    const handleEdit = (section) => {
        setEditingSectionId(section.id);
        setEditedSectionName(section.sectionName);
        setEditedPoints(section.points);
        setLocked(section.locked)
        setAchievementId(section.achievementId)
        setDescription(section.description)

    };

    const handleSave = async (id) => {
        try {
            await put(`/section/${id}`, { Name: editedSectionName, Points: editedPoints, Locked: locked, achievementId: achievementId, Image: image, description: editedDescription  }); 
            setSections(
                sections.map((section) =>
                    section.id === id ? { ...section, sectionName: editedSectionName, points: Number(editedPoints), locked: Boolean(locked) } : section
                )
            );
            setEditingSectionId(null);
        } catch (error) {
            console.error("Error updating section:", error);
        }
    };

    useEffect(() => {

            const getAchievements = async () => {
                const res = await get("/achievements");

        
                const achievementsArray = res.$values || res;
                setAchievements(achievementsArray);
                console.log("achievements: ",achievementsArray)
          };
          getAchievements();
   

    }, [editingSectionId])


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


    //Achievement id lookup mot achievements liste. Finner url til achievementId i parameter
    const getAchievementIcon = (achievementId) => {
        const achievement = achievements.find(a => a.id == achievementId);
        console.log("Achievements: ",achievement)
        return achievement?.url || "https://tenk-kritisk.no/avatars/Heart.png";
    }

    const handleCancelEdit = () => {
        setEditingSectionId(null);
    };

    useEffect(() => {
        console.log(achievementId)
        console.log()
    },[achievementId])

    

    if (loading) return <p>Loading sections...</p>;
    if (sections.length === 0) return <p>Ingen moduler tilgjengelig</p>;

    return (
        <div className="section-list-container">
            <h3>Modul liste</h3>
            <ul>
                {sections.map((section) => (
                    <li key={section.id} className="section-list-item">
                        <img className="list-icon" src={section.image}></img>
                        {editingSectionId === section.id ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(section.id) }}>
                                {/* Change section name */}
                                <h5 style={{textAlign: "center"}}>Tittel</h5>                                
                                <input
                                    type="text"
                                    value={editedSectionName}
                                    onChange={(e) => setEditedSectionName(e.target.value)}
                                />
                                {/* Change section points */}
                                <h5 style={{textAlign: "center"}}>Poeng</h5>
                                <input
                                    type="text"
                                    value={editedPoints}
                                    onChange={(e) => setEditedPoints(e.target.value)}
                                />
                                {/* Change section description */}
                                <h5 style={{textAlign: "center"}}>Forklaring</h5>
                                <input
                                    type="text"
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                />
                                {/* Change section lock status */}
                                <h5 style={{textAlign: "center"}}>Lås modul</h5>
                                <input
                                    type="checkbox"
                                    checked={locked ?? false}
                                    onChange={(e) => setLocked(e.target.checked)}
                                />
                                    <h5 style={{textAlign: "center"}}>Endre modul-ikon</h5>
                                {/* Change section icon */}
                                <div className="achievement-grid">

                                    {icons.map((icon) => (
                                        <div key={icon.id} className="achievement-item">
                                        <img
                                            src={icon.url}
                                            alt={icon.name}
                                            className={`achievement-item-sectionlist ${image === icon.url ? "selected" : ""}`}
                                            onClick={() => setImage(icon.url)}
                                        />
                                        </div>                                                            
                            ))}
                            </div>
                            
                            <h5 style={{textAlign: "center"}}>Endre modul-oppnåelse</h5>
                                {/* Change section achievement */}
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




                                <button type="submit" className="btn-save">Lagre</button>
                                <button type="button" className="btn-cancel" onClick={handleCancelEdit}>Kansellere</button>
                            </form>
                        ) : (
                            <div>
                                {/* Module list item display */}
                                <Link to={`/section/${section.id}/questions`}>
                                    {section.sectionName} ({section.points}p)
                                </Link>
                            <img className="achievement-icon-section-list" src={getAchievementIcon(section.achievementId)}></img>
                                <button className="btn-edit" onClick={() => handleEdit(section)}>Oppdater</button>
                               <button className="btn-delete" onClick={() => handleDelete(section.id)}>Slett</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SectionList;



