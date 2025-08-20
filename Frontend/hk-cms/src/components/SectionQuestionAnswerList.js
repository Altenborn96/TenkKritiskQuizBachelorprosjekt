import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get, post } from "../services/Api"; // Import get and post methods from Api.js
import "./../css/SideBar.css";

const SectionQuestionAnswerList = () => {
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [sidebarWidth, setSidebarWidth] = useState(20); // Width in vw (viewport width percentage)
  const [newSectionName, setNewSectionName] = useState(""); // For adding section
  const [showAddSectionForm, setShowAddSectionForm] = useState(false); // Toggle form visibility
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = () => {
    get("/section/WithDetails")
      .then((data) => {
        const sectionsData = data.$values || data;
        setSections(sectionsData);
      })
      .catch((error) => console.error("Error fetching sections:", error));
  };

  const refreshSections = () => {
    fetchSections(); // Call the fetch function to update sections
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const extractValues = (data) => {
    return data?.$values || data;
  };

  const handleSidebarResize = (e) => {
    setSidebarWidth(e.target.value);
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (newSectionName.trim() === "") {
      setError("Section name is required.");
      return;
    }

    try {
      const response = await post("/section", { name: newSectionName }); // Use your post helper here
      setSections([...sections, response]); // Add new section to the state
      setNewSectionName(""); // Clear input field
      setShowAddSectionForm(false); // Hide the form
    } catch (error) {
      setError("Error creating section.");
      console.error("There was an error creating the section!", error);
    }
  };

  return (
    <div>
      {/* Sidebar with dynamic width */}
      <div className="side-panel" style={{ width: `${sidebarWidth}vw` }}>
        <h3>
          Moduler
          {/* Add a green "+" button to add new sections */}
          <button
            className="add-section-btn"
            onClick={() => setShowAddSectionForm(!showAddSectionForm)}
          >
            +
          </button>
          {/* Add a refresh button next to the add button */}
          <button
            className="refresh-section-btn"
            onClick={refreshSections}
            title="Refresh Sections"
          >
            🔄
          </button>
        </h3>

        {/* Show the form to add a section when the button is clicked */}
        {showAddSectionForm && (
          <form onSubmit={handleAddSection} className="add-section-form">
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Ny modul tittel"
            />
            <button className="add-btn" type="submit">Legg til Modul</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}

        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              {/* Pass the state when navigating to the section questions page */}
              <Link
                to={`/section/${section.id}/questions`}
                state={{ fromSectionId: section.id }} // Pass the section ID in state here
                onClick={() => toggleSection(section.id)}
              >
                {section.sectionName}
              </Link>
              {expandedSections[section.id] && (
                <ul>
                  {extractValues(section.questions).map((question) => (
                    <li key={question.id}>
                      {/* Pass the state when navigating to the question answers page */}
                      <Link
                        to={`/question/${question.id}/answers`}
                        state={{ fromSectionId: section.id }} // Pass the section ID here as well
                        onClick={() => toggleQuestion(question.id)}
                      >
                        {question.questionText}
                      </Link>
                      {expandedQuestions[question.id] && (
                        <ul>
                          {extractValues(question.answers).map((answer) => (
                            <li key={answer.id}>
                                  {answer.answerText} ({answer.score ?? 0}) {/* Viser score med fallback-verdi */}
                                  {answer.isCorrect && <span className="correct-answer">✔</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Range slider to control sidebar width */}
      <div className="sidebar-resizer">
        <input
          id="sidebarWidth"
          type="range"
          min="10"
          max="50"
          value={sidebarWidth}
          onChange={handleSidebarResize}
        />
      </div>
    </div>
  );
};

export default SectionQuestionAnswerList;
