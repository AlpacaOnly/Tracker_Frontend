import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./Home";
import Profile from "./Profile";
import Grades from "./Grades";
import Assignments from "./Assignments";
import Examinations from "./Examinations";
import ExamDetailPage from "./ExamDetailPage";
import AddExamination from "./AddExamination";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
          <Route index element={<SignUp />} />
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="grades" element={<Grades />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="examinations" element={<Examinations />} />
          <Route path="/exam/:subject" element={<ExamDetailPage />} />
          <Route path="examination/add" element={<AddExamination />} />
        
    
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
