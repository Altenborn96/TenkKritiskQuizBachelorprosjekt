import React, { useEffect, useState } from "react";
import { del, get, patch, post, put } from "../../services/Api";
import "../../css/settings/FAQ.css";

interface FAQ {
  id?: number;
  question: string;
  identifier: string;
  answer: string;
}

const FAQ = () => {
  const [faq, setFAQ] = useState<FAQ[]>([]);
  const [editId, setEditId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  //Get faq by identifier "(FAQ)"
  const getFAQ = async () => {
    try {
      const data = await get(`/settings/faq`);
      const faqArray: FAQ[] = data.$values;
      console.log("Oppdatert faq:", faqArray);
      setFAQ(faqArray);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //Add new faq
  const addFAQ = async (identifier) => {
    try {
      const faqDto: FAQ = {
        question: newTitle,
        answer: newDescription,
        identifier: identifier,
      };

      await post("/cms/settings", faqDto);

      setNewTitle("");
      setNewDescription("");

      await getFAQ();
    } catch (error: any) {}
  };

  //Update existing faq in backend (endpoint / body)
  const updateFAQ = async (id, identifier) => {
    try {
      const faqDto: FAQ = {
        id: id,
        answer: editedDescription,
        question: editedTitle,
        identifier: identifier,
      };

      await patch("/cms/settings", faqDto);
      await getFAQ();
      setEditId(null);
    } catch (error: any) {
      console.log(error);
    }
  };

  //Handle edit faq
  const handleEdit = (id, answer, question) => {
    setEditedDescription(answer);
    setEditedTitle(question);
    setEditId(id);
  };

  //Delete faq
  const deleteFAQ = async (id) => {
    try {
      await del(`/cms/settings/${id}`);
      await getFAQ();
    } catch (error: any) {}
  };

  const handleCancel = async () => {
    setEditId(null);
    setEditedDescription("");
    setEditedTitle("");
    setEditId(null);
  };

  useEffect(() => {
    getFAQ();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", padding: "50px" }}>FAQ</h1>

      {/* Add faq */}
      <div className="faq-add-container">
        <h2>Legg til nytt spørsmål</h2>
        <h5 style={{ marginTop: "60px" }}>Spørsmål</h5>
        <textarea
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ fontSize: "20px" }}
        ></textarea>
        <h5>Svar</h5>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ height: "100px", fontSize: "20px" }}
        ></textarea>

        <button
          onClick={() => addFAQ("FAQ")}
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

      {/* FAQ list */}
      <ul>
        {faq.map((faq) => (
          <React.Fragment key={faq.id}>
            <li className="faq-list-item">
              <h3 className="faq-list-question">{faq.question}</h3>
              <p className="faq-list-answer">{faq.answer}</p>

              <button
                onClick={() => handleEdit(faq.id, faq.answer, faq.question)}
                className="faq-list-update-button"
              >
                Oppdater
              </button>
              <button
                onClick={() => deleteFAQ(faq.id)}
                className="faq-list-delete-button"
              >
                Slett
              </button>
            </li>

            {/* Under redigering */}
            {editId === faq.id && (
              <div className="faq-list-edit-container">
                <h5>Spørsmål</h5>
                <textarea
                  onChange={(e) => setEditedTitle(e.target.value)}
                  defaultValue={faq.question}
                  style={{ width: "800px", fontFamily: "verdana" }}
                />
                <h5>Svar</h5>
                <textarea
                  onChange={(e) => setEditedDescription(e.target.value)}
                  defaultValue={faq.answer}
                  style={{
                    width: "800px",
                    height: "150px",
                    fontFamily: "verdana",
                  }}
                />
                <br />
                <button
                  onClick={() => updateFAQ(faq.id, faq.identifier)}
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

export default FAQ;
