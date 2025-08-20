import React, { useEffect, useState } from "react";
import { get, patch, post } from "../../services/Api";
import "../../css/settings/AboutUs.css";

interface AboutUs {
  id: number;
  title: string;
  description: string;
  identifier: string;
}

const AboutUs = () => {
  const [description, setDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editActive, setEditActive] = useState(false);
  const [id, setId] = useState(0);

  //Get aboutus by identifier "(TERMS)"
  const getAboutUs = async () => {
    try {
      const data = await get("/settings/about");

      setDescription(data["$values"][0].description);
      setId(data["$values"][0].id);

      console.log("description: ", data.description);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //Save new about us
  const saveAboutUs = async () => {
    const dto: AboutUs = {
      id: id,
      title: "Om oss",
      description: newDescription,
      identifier: "ABOUT",
    };

    await patch("/cms/settings", dto);
    await getAboutUs();
    setEditActive(false);
  };

  //Handle editing status
  const handleEdit = (boolean) => {
    setEditActive(boolean);
    if (boolean == false) {
      setNewDescription("");
    }
  };

  useEffect(() => {
    getAboutUs();
  }, []);

  useEffect(() => {
    console.log("newdescription: ", newDescription);
  }, [newDescription]);

  return (
    <div className="aboutus-container">
      {!editActive ? (
        <div className="aboutus-div">
          <h1 style={{ textAlign: "center" }}>Om oss</h1>
          <button onClick={() => handleEdit(true)}>Oppdater </button>{" "}
          <p>{description}</p>
        </div>
      ) : (
        <div className="aboutus-div">
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
            onClick={() => saveAboutUs()}
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
            defaultValue={description}
            onChange={(e) => setNewDescription(e.target.value)}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
