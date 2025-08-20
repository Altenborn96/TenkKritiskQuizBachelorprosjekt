
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./../css/NavBar.css";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle Back to Questions navigation
  const handleBackToQuestions = () => {
    // Retrieve the sectionId from location.state (set when navigating to the question page)
    const sectionId = location.state?.fromSectionId;
    console.log('Section ID from state:', sectionId); // This will help you debug
    
    if (sectionId) {
      // If sectionId is available, navigate back to the section's question list
      navigate(`/section/${sectionId}/questions`);
    } else {
      // If no sectionId, fall back to the sections list
      navigate('/sections');
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/sections">Moduler</Link>
        </li>
        {location.pathname.startsWith('/question/') && (
          <li>
            <button onClick={handleBackToQuestions}>Tilbake til spørsmål</button>
          </li>
        )}
        <li>
          <Link to="/players">Players</Link> 
        </li>
        <li>
          <Link to="/avatars">Avatars</Link>
        </li>
        <li>
          <Link to="/achievements">Achievements</Link>
        </li>
        <li>
          <Link to="/icons">Icons</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <Link to="/feedback">Feedback</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
