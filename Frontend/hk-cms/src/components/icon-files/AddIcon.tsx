import React, { useState } from "react";
import { baseURL } from "../../services/Api";
import "../../css/Icon.css";

interface Props {
  onUpload: () => void;
}

const AddIcon = ({ onUpload }: Props) => {
  const [selectedFile, setSelectedFile] = useState([]);
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

    try {
      const response = await fetch(`${baseURL}/icons/add`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      setSuccess("Icon lastet opp!");
      setSelectedFile([]);

      onUpload();
    } catch (error) {
      setError(error.message || "Noe gikk galt");
    }
  };

  return (
    <div className="add-icon-container">
      <h3 className="icon-title">Last opp ikon</h3>
      <p className="p">I PNG format for å unngå feil</p>

      <input
        className="file-selector"
        type="file"
        onChange={handleFileChange}
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

export default AddIcon;
