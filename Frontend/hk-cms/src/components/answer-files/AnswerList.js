import React, { useState, useEffect } from "react";
import { del, put } from "../../services/Api"; // Import delete and put methods from Api.js
import "../../css/Answer.css";

const AnswerList = ({ answers, fetchAnswers }) => {
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [newAnswerText, setNewAnswerText] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [newScore, setNewScore] = useState("");


  const handleDelete = async (id) => {
    try {
      await del(`/answers/${id}`); // Use the delete helper function
      fetchAnswers();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const handleEdit = (answer) => {
    setEditingAnswer(answer.id);
    setNewAnswerText(answer.answerText);
    setIsCorrect(answer.correct);
      setNewScore(answer.score)
      //console.log("Score fra handle edit: " + answer.score)
  };

  const handleUpdate = async (id) => {
      try {

      const json = await put(`/answers/${id}`, {
        AnswerText: newAnswerText,
          Correct: isCorrect,
          Score: parseInt(newScore),
        // QuestionId: answers[0].questionId, // Assuming answers always have at least one item
        QuestionId: answers.$values && answers.$values.length > 0 ? answers.$values[0].questionId : null,

      });
        console.log(JSON.stringify(json))

      setEditingAnswer(null);
      fetchAnswers();
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      handleUpdate(id);
    }
    };

    useEffect(() => {
        console.log("Score endret til: " + newScore)
    }, [newScore])

  const answerArray = answers.$values || answers;

  if (!Array.isArray(answerArray) || answerArray.length === 0) {
    return <p>No answers available.</p>;
  }

  return (
    <div className="answer-list-container">
      <h3>Svar</h3>
      <ul className="answer-list">
        {answerArray.map((answer) => (
          <li key={answer.id} className="answer-item">
            {editingAnswer === answer.id ? (
              <>
                <input
                  type="text"
                  value={newAnswerText}
                  onChange={(e) => setNewAnswerText(e.target.value)}
                  className="input-edit"
                  onKeyDown={(e) => handleKeyDown(e, answer.id)}
                />
                <input
                  type="checkbox"
                  checked={isCorrect}
                  onChange={(e) => setIsCorrect(e.target.checked)}
                  className="input-checkbox"
                        />
                <input
                  type="text"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="input-edit"
                            onKeyDown={(e) => handleKeyDown(e, answer.id)}
                        />

                <button onClick={() => handleUpdate(answer.id)} className="btn-save">
                  Lagre
                </button>
                <button onClick={() => setEditingAnswer(null)} className="btn-cancel">
                  Kansellere
                </button>
              </>
            ) : (
                        <>
                            <span>{answer.answerText} ({answer.score ?? 0}) - {answer.correct ? "Correct" : "Incorrect"}</span>

                <button onClick={() => handleEdit(answer)} className="btn-edit">
                  Oppdater
                </button>
                <button onClick={() => handleDelete(answer.id)} className="btn-delete">
                  Slett
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnswerList;
