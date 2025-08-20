import React from "react";
import { useState, useEffect } from "react";
import { baseURL } from "../../services/Api";

interface Props {
  onUpload: () => void;
}

const AddAchievement = ({ onUpload }: Props) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [achievementName, setAchievementName] = useState("");
  const [achievementDescription, setAchievementDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };

  const handleFileUpload = async () => {
    setError("");
    setSuccess("");
    if (!selectedFile || selectedFile.length === 0) {
      console.warn("Ingen fil valgt");
      return;
    }

    const file = selectedFile[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", achievementName);
    formData.append("description", achievementDescription);

    try {
      const response = await fetch(`${baseURL}/achievements`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      setSuccess("Achievement lastet opp!");
      setSelectedFile([]);
      setAchievementName("");
      setAchievementDescription("");
      onUpload();
    } catch (error) {
      setError(error.message || "Noe gikk galt");
    }
  };

  useEffect(() => {
    console.log(achievementName);
  }, [achievementName]);

  return (
    <div className="add-achievement-container">
      <h3 className="achievement-title">Last opp achievement</h3>
      <p className="p">I PNG format for å unngå feil</p>

      <input
        className="file-selector"
        type="file"
        onChange={handleFileChange}
      />

      <h5 className="achievementName">Achievement-navn</h5>
      <input
        className="achievement-name-tag"
        value={achievementName}
        onChange={(event) => setAchievementName(event.target.value)}
      />

      <button className="upload-button" onClick={handleFileUpload}>
        Last opp
      </button>
      {error && <p className="status-false">{error}</p>}
      {success && <p className="status-true">{success}</p>}
    </div>
  );
};

export default AddAchievement;
