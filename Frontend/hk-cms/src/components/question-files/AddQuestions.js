import React, { useState, useEffect, useCallback } from "react";
import { get, post } from "../../services/Api"; // Import get and post methods from Api.js
import { useParams } from "react-router-dom";
import QuestionList from "./QuestionList";
import "../../css/Question.css";

const AddQuestions = () => {
  const [questionText, setQuestionText] = useState("");
  const { sectionId } = useParams(); // Get sectionId from the URL
  const [questions, setQuestions] = useState([]); // Store the list of questions
  const [section, setSection] = useState(null); // Store the section details 


  // Fetch section details (including section name)
const fetchSectionDetails = useCallback(async () => {
  try {
    const response = await get(`/section/${sectionId}`); 
    console.log("Raw section response:", response); 

    const sectionData = response.$values ? response.$values[0] : response;

    setSection(sectionData); 
  } catch (error) {
    console.error("Error fetching section details:", error);
  }
}, [sectionId]);


  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    try {
      console.log("Fetching questions for sectionId:", sectionId);
      const response = await get(`/questions/section/${sectionId}`); // Use get helper
      console.log("Response from API:", response); // Log the response for debugging

     
      setQuestions(response.questions || response.$values || []); 
    } catch (error) {
      console.error("Error fetching questions:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  }, [sectionId]); // Recreate the function only when sectionId changes

  useEffect(() => {
    fetchSectionDetails(); // Fetch section details when the sectionId changes
    fetchQuestions(); // Fetch questions when the sectionId changes
  }, [fetchSectionDetails, fetchQuestions]); // Now both functions are stable dependencies

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sectionId) {
      alert("Section ID is required.");
      return;
    }

    if (questionText === "") {
      alert("Question text is required.");
      return;
      }




    try {
      await post(`/questions/${sectionId}`, {
        QuestionText: questionText,
          SectionId: parseInt(sectionId),
          Score: 500

        
      }); // Use post helper

      setQuestionText(""); // Clear input
      fetchQuestions(); // Refresh the question list after adding a new question
    } catch (error) {
      console.error("There was an error adding the question:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="add-question-container">
      <h2>Håndter spørsmål til {section ? section.name : "Modul"}</h2> {/* Display section name */}
      
      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-group">
          <label>Spørsmålstekst : </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Skriv inn spørsmålstekst"
            className="input-text"
            rows="4" // Adjust the number of rows as needed
          />
        </div>
        <button type="submit" className="submit-btn">Legg til spørsmål</button>
      </form>

      <QuestionList questions={questions} fetchQuestions={fetchQuestions} />
    </div>
  );
};

export default AddQuestions;

