import React, { useEffect, useState } from "react";
import { get } from "../../services/Api";

const Privacy = () => {
  const [privacy, setPrivacy] = useState("");

  useEffect(() => {
    const getPrivacy = async () => {
      try {
        const data = await get("/settings/privacy");

        setPrivacy(data["$values"][0].content);

        console.log("content: ", data["$values"][0].content);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getPrivacy();
  }, []);

  return (
    <div>
      <h2>Privacy Policy</h2>

      <p>{privacy}</p>
    </div>
  );
};

export default Privacy;
