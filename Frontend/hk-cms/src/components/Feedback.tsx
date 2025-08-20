import React, { useEffect, useState } from "react";
import { del, get } from "../services/Api";
import "../css/Feedback.css";

interface FeedbackDto {
  id: number;
  recommendScore?: number;
  funScore?: number;
  satisfiedScore?: number;
  suggestionComment?: string;
  generalComment?: string;
  identifier: string;
}

const Feedback = () => {
  const [commentFeedback, setCommentFeedback] = useState<FeedbackDto[] | null>(
    []
  );
  const [ratingFeedback, setRatingFeedback] = useState<FeedbackDto[] | null>(
    []
  );

  //Set 2 different arrays for rating and commenting
  const getFeedback = async () => {
    try {
      const commentData = await get("/cmsfeedback/comment");

      const ratingData = await get("/cmsfeedback/score");

      const commentArray: FeedbackDto[] = commentData.$values;
      const ratingArray: FeedbackDto[] = ratingData.$values;

      setCommentFeedback(commentArray);
      setRatingFeedback(ratingArray);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await del(`/cmsfeedback/${id}`);

      getFeedback();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getFeedback();
  }, []);

  return (
    <div className="feedback-container">
      <h1>Feedback</h1>

      <div className="feedback-columns">
        <div className="comment-section">
          <h2 className="h2">Kommentarer:</h2>
          {commentFeedback?.map((item) => (
            <ul key={`comment-${item.id}`}>
              <div className="comment-list-item">
                <li>
                  <div className="comment-container">
                    <h5 className="comment-list-header">Generell kommentar</h5>
                    <p className="comment-list-text">{item.generalComment}</p>

                    <h5 className="comment-list-header">Forslag</h5>
                    <p className="comment-list-text">
                      {item.suggestionComment}
                    </p>
                  </div>
                </li>
                <button
                  style={{ color: "red" }}
                  onClick={() => deleteFeedback(item.id)}
                >
                  Slett
                </button>
              </div>
            </ul>
          ))}
        </div>

        <div className="rating-section">
          <h2 className="h2">Rangeringer:</h2>
          {ratingFeedback?.map((item) => (
            <ul key={`rating-${item.id}`}>
              <li>
                <div className="rating-box">
                  <p>
                    Anbefaling: {item.recommendScore} <br />
                    Gøy: {item.funScore} <br />
                    Fornøyd: {item.satisfiedScore}
                  </p>
                </div>
              </li>
              <button
                style={{ color: "red" }}
                onClick={() => deleteFeedback(item.id)}
              >
                Slett
              </button>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
