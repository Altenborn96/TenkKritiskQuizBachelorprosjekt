import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sections from "./pages/Sections";
import AddQuestions from "./components/question-files/AddQuestions";
import AddAnswers from "./components/answer-files/AddAnswers";
import SectionQuestionAnswerList from "./components/SectionQuestionAnswerList";
import PlayerList from "./components/PlayerList";
import AvatarList from "./components/avatar-files/AvatarList";
import AchievementList from "./components/achievement-files/AchievementList.tsx";
import IconList from "./components/icon-files/IconList.tsx";
import Settings from "./components/settings-files/Settings.tsx";
import Feedback from "./components/Feedback.tsx";

const AppRoutes = () => {
  const location = useLocation();
  const showSidebar = location.pathname === "/sections";

  return (
    <>
      <div className="main-container">
        {showSidebar && <SectionQuestionAnswerList />}

        <Routes>
          <Route path="/*" element={<AppRoutes />} />
          <Route path="/sections" element={<Sections />} />
          <Route path="/section/:sectionId/questions" element={<AddQuestions />} />
          <Route path="/question/:questionId/answers" element={<AddAnswers />} />
          <Route path="/players" element={<PlayerList />} />
          <Route path="/avatars" element={<AvatarList />} />
          <Route path="/achievements" element={<AchievementList />} />
          <Route path="/icons" element={<IconList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/feedback" element={<Feedback />} />
          
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
