import React, { useEffect, useState } from "react";
import { get, patch, post } from "../../services/Api";
import "../../css/settings/Privacy.css";

interface Privacy {
  id: number;
  title: string;
  content: string;
  identifier: string;
}

const Privacy = () => {
  const [content, setContent] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editActive, setEditActive] = useState(false);
  const [id, setId] = useState(0);

  //Get privacy by identifier "(TERMS)"
  const getPrivacy = async () => {
    try {
      const data = await get("/settings/privacy");

      setContent(data["$values"][0].content);
      setId(data["$values"][0].id);

      console.log("content: ", data.content);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //Save  privacy
  const savePrivacy = async () => {
    const dto: Privacy = {
      id: id,
      title: "Personvern",
      content: newContent,
      identifier: "PRIVACY",
    };

    await patch("/cms/settings", dto);
    await getPrivacy();
    setEditActive(false);
  };

  //Handle editing status
  const handleEdit = (boolean) => {
    setEditActive(boolean);
    if (boolean == false) {
      setNewContent("");
    }
  };

  useEffect(() => {
    getPrivacy();
  }, []);

  useEffect(() => {
    console.log("newcontent: ", newContent);
  }, [newContent]);

  return (
    <div className="privacy-container">
      {!editActive ? (
        <div className="privacy-div">
          <h1 style={{ textAlign: "center" }}>Personvern</h1>
          <button onClick={() => handleEdit(true)}>Oppdater </button>{" "}
          <p>{content}</p>
        </div>
      ) : (
        <div className="privacy-div">
          {" "}
          <h1 style={{ textAlign: "center" }}>Om oss</h1>
          <p>\n = linjeskifte</p>
          <button
            style={{
              position: "relative",
              left: "90%",
              margin: "10px",
              color: "red",
            }}
            onClick={() => handleEdit(false)}
          >
            Avbryt
          </button>
          <button
            style={{
              position: "relative",
              left: "70%",
              margin: "10px",
              color: "green",
            }}
            onClick={() => savePrivacy()}
          >
            Lagre
          </button>
          <textarea
            style={{
              width: "99.5%",
              height: "800px",
              fontFamily: "verdana",
              fontSize: "18px",
            }}
            defaultValue={content}
            onChange={(e) => setNewContent(e.target.value)}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default Privacy;
