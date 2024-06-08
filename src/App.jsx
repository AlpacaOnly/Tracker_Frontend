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
import UpdateExamination from "./UpdateExamination";
import { useEffect } from "react";
import Solutions from "./Solutions";
import Results from "./Results";


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
          <Route path="results" element={<Results />} />
          <Route path="/exam/:examid" element={<ExamDetailPage />} />
          <Route path="/exam/:examid/solutions" element={<Solutions />} />
          <Route path="examination/add" element={<AddExamination />} />
          <Route path="examination/update/:examid" element={<UpdateExamination />} />
        
    
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
