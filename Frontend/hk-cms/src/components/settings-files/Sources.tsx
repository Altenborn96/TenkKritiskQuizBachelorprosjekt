import React, { useEffect, useState } from "react";
import { del, get, patch, post, put } from "../../services/Api";
import "../../css/settings/Sources.css";

interface Sources {
  id?: number;
  description: string;
  identifier: string;
  link: string;
}

const Sources = () => {
  const [sources, setSources] = useState<Sources[]>([]);
  const [editId, setEditId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  //Get sources by identifier "(Sources)"
  const getSources = async () => {
    try {
      const data = await get(`/settings/sources`);
      const sourcesArray: Sources[] = data.$values;
      console.log("Oppdatert sources:", sourcesArray);
      setSources(sourcesArray);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //Add new sources
  const addSources = async (identifier) => {
    try {
      const sourcesDto: Sources = {
        description: newTitle,
        link: newDescription,
        identifier: identifier,
      };

      await post("/cms/settings", sourcesDto);

      setNewTitle("");
      setNewDescription("");

      await getSources();
    } catch (error: any) {}
  };

  //Update existing sources in backend (endpoint / body)
  const updateSources = async (id, identifier) => {
    try {
      const sourcesDto: Sources = {
        id: id,
        link: editedDescription,
        description: editedTitle,
        identifier: identifier,
      };

      await patch("/cms/settings", sourcesDto);
      await getSources();
      setEditId(null);
    } catch (error: any) {
      console.log(error);
    }
  };

  //Handle edit sources
  const handleEdit = (id, link, description) => {
    setEditedDescription(link);
    setEditedTitle(description);
    setEditId(id);
  };

  //Delete sources
  const deleteSources = async (id) => {
    try {
      await del(`/cms/settings/${id}`);
      await getSources();
    } catch (error: any) {}
  };

  const handleCancel = async () => {
    setEditId(null);
    setEditedDescription("");
    setEditedTitle("");
    setEditId(null);
  };

  useEffect(() => {
    getSources();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", padding: "50px" }}>Kilder</h1>

      {/* Add sources */}
      <div className="sources-add-container">
        <h2>Legg til ny kilde</h2>
        <h5 style={{ marginTop: "60px" }}>Tittel</h5>
        <textarea
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ fontSize: "20px" }}
        ></textarea>
        <h5>Kilde</h5>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ height: "100px", fontSize: "20px" }}
        ></textarea>

        <button
          onClick={() => addSources("Sources")}
          style={{
            width: "100px",
            color: "green",
            alignSelf: "center",
            marginTop: "50px",
          }}
        >
          Lagre
        </button>
      </div>

      {/* Sources list */}
      <ul>
        {sources.map((source) => (
          <React.Fragment key={source.id}>
            <li className="sources-list-item">
              <h3 className="sources-list-description">{source.description}</h3>
              <a
                target="_blank"
                href={source.link}
                className="sources-list-link"
                rel="noopener noreferrer"
              >
                {source.link}
              </a>

              <button
                onClick={() =>
                  handleEdit(source.id, source.link, source.description)
                }
                className="sources-list-update-button"
              >
                Oppdater
              </button>
              <button
                onClick={() => deleteSources(source.id)}
                className="sources-list-delete-button"
              >
                Slett
              </button>
            </li>

            {/* Under redigerng */}
            {editId === source.id && (
              <div className="sources-list-edit-container">
                <h5>Tittel</h5>
                <textarea
                  onChange={(e) => setEditedTitle(e.target.value)}
                  style={{ width: "700px", fontFamily: "verdana" }}
                  defaultValue={source.description}
                />
                <h5>Kildelink</h5>
                <textarea
                  onChange={(e) => setEditedDescription(e.target.value)}
                  defaultValue={source.link}
                  style={{
                    width: "700px",
                    height: "50px",
                    fontFamily: "verdana",
                  }}
                />
                <br />
                <button
                  onClick={() => updateSources(source.id, source.identifier)}
                  style={{ color: "green" }}
                >
                  Lagre
                </button>
                <button onClick={handleCancel} style={{ color: "red" }}>
                  Kanseller
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Sources;
