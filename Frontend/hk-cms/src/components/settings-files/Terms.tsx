import React, { useEffect, useState } from "react";
import { del, get, patch, post, put } from "../../services/Api";
import "../../css/settings/Terms.css";

interface Terms {
  id?: number;
  description: string;
  identifier: string;
  title: string;
}

const Terms = () => {
  const [terms, setTerms] = useState<Terms[]>([]);
  const [editId, setEditId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  //Get terms by identifier "(TERMS)"
  const getTerms = async () => {
    try {
      const data = await get(`/settings/terms`);
      const termsArray: Terms[] = data.$values;
      console.log("Oppdatert terms:", termsArray);
      setTerms(termsArray);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //Add new term
  const addTerm = async (identifier) => {
    try {
      const termsDto: Terms = {
        title: newTitle,
        description: newDescription,
        identifier: identifier,
      };

      await post("/cms/settings", termsDto);

      setNewTitle("");
      setNewDescription("");

      await getTerms();
    } catch (error: any) {}
  };

  //Update existing term in backend (endpoint / body)
  const updateTerm = async (id, identifier) => {
    try {
      const termsDto: Terms = {
        id: id,
        description: editedDescription,
        title: editedTitle,
        identifier: identifier,
      };

      await patch("/cms/settings", termsDto);
      await getTerms();
      setEditId(null);
    } catch (error: any) {
      console.log(error);
    }
  };

  //Handle edit term
  const handleEdit = (id, description, title) => {
    setEditedDescription(description);
    setEditedTitle(title);
    setEditId(id);
  };

  //Delete term
  const deleteTerm = async (id) => {
    try {
      await del(`/cms/settings/${id}`);
      await getTerms();
    } catch (error: any) {}
  };

  const handleCancel = async () => {
    setEditId(null);
    setEditedDescription("");
    setEditedTitle("");
    setEditId(null);
  };

  useEffect(() => {
    getTerms();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", padding: "50px" }}>Begreper</h1>

      {/* Add terms */}
      <div className="terms-add-container">
        <h2>Legg til nytt begrep</h2>
        <h5 style={{ marginTop: "60px" }}>Begrep</h5>
        <textarea
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ fontSize: "20px" }}
        ></textarea>
        <h5>Forklaring</h5>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ height: "100px", fontSize: "20px" }}
        ></textarea>

        <button
          onClick={() => addTerm("TERMS")}
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

      {/* Terms list */}
      <ul>
        {terms.map((term) => (
          <React.Fragment key={term.id}>
            <li className="terms-list-item">
              <h3 className="terms-list-title">{term.title}</h3>
              <p className="terms-list-description">{term.description}</p>

              <button
                onClick={() =>
                  handleEdit(term.id, term.description, term.title)
                }
                className="terms-list-update-button"
              >
                Oppdater
              </button>
              <button
                onClick={() => deleteTerm(term.id)}
                className="terms-list-delete-button"
              >
                Slett
              </button>
            </li>

            {/* When editing, show edit block AFTER <li> */}
            {editId === term.id && (
              <div className="terms-list-edit-container">
                <h5>Begrep</h5>
                <textarea
                  onChange={(e) => setEditedTitle(e.target.value)}
                  defaultValue={term.title}
                  style={{ width: "700px", fontFamily: "verdana" }}
                />
                <h5>Forklaring</h5>
                <textarea
                  onChange={(e) => setEditedDescription(e.target.value)}
                  defaultValue={term.description}
                  style={{
                    width: "700px",
                    height: "150px",
                    fontFamily: "verdana",
                  }}
                />
                <br />
                <button
                  onClick={() => updateTerm(term.id, term.identifier)}
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

export default Terms;
