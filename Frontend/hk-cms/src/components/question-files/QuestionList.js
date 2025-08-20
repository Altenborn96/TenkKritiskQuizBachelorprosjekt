import React, { useState } from "react";
import { Link } from "react-router-dom";
import { del, put } from "../../services/Api"; // Import delete (del) and put methods from Api.js
import "../../css/Question.css";

const QuestionList = ({ questions = {}, fetchQuestions }) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState("");

  // Use Array.isArray to check if questions is an array; if not, use $values or fallback to empty array
  const questionArray = Array.isArray(questions) ? questions : questions.$values || [];

  const handleDelete = async (id) => {
    try {
      await del(`/questions/${id}`); // Use del helper method
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question.id);
    setNewQuestionText(question.questionText);
  };

  const handleUpdate = async (id) => {
    try {
      await put(`/questions/${id}`, {
        QuestionText: newQuestionText,
        SectionId: questionArray[0]?.sectionId, // Use optional chaining to prevent errors
      }); // Use put helper method
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      handleUpdate(id);
    }
  };

  // Display loading message or fallback if questions are not available
  if (!questions || (Array.isArray(questions) && questions.length === 0)) {
    return <p>Loading or no questions available.</p>;
  }

  return (
    <div className="question-list-container">
      <h3>Spørsmål</h3>
      <ul className="question-list">
        {questionArray.map((question) => (
          <li key={question.id} className="question-list-item">
            {editingQuestion === question.id ? (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdate(question.id); }}>
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="input-edit"
                  onKeyDown={(e) => handleKeyDown(e, question.id)}
                />
                <button type="submit" className="btn-save">Lagre</button>
                <button type="button" onClick={() => setEditingQuestion(null)} className="btn-cancel">Kansellere</button>
              </form>
            ) : (
              <div>
                <Link
                  to={`/question/${question.id}/answers`}
                  state={{ fromSectionId: question.sectionId }}
                  className="question-link"
                >
                  {question.questionText}
                </Link>
                <button onClick={() => handleEdit(question)} className="btn-edit">Oppdater</button>
                <button onClick={() => handleDelete(question.id)} className="btn-delete">Slett</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
