import React, { useEffect, useState } from "react";
import { baseURL } from "../../services/Api";

interface Props {
  onUpload: () => void;
}

const UploadAvatar = ({ onUpload }: Props) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [avatarName, setAvatarName] = useState("");
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
    formData.append("name", avatarName);

    try {
      const response = await fetch(`${baseURL}/avatars/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      setSuccess("Avatar lastet opp!");
      setSelectedFile([]);
      setAvatarName("");
      onUpload();
    } catch (error) {
      setError(error.message || "Noe gikk galt");
    }
  };

  useEffect(() => {
    console.log(avatarName);
  }, [avatarName]);

  return (
    <div className="upload-avatar-container">
      <h3 className="avatar-title">Last opp avatar</h3>
      <p className="p">I PNG format for å unngå feil</p>

      <input
        className="file-selector"
        type="file"
        onChange={handleFileChange}
      />

      <h5 className="avatarName">Avatarnavn</h5>
      <input
        className="avatar-name-tag"
        value={avatarName}
        onChange={(event) => setAvatarName(event.target.value)}
      />

      <button
        className="upload-button"
        onClick={() => {
          handleFileUpload();
        }}
      >
        Last opp
      </button>
      {error && <p className="status-false">{error}</p>}
      {success && <p className="status-true">{success}</p>}
    </div>
  );
};

export default UploadAvatar;
