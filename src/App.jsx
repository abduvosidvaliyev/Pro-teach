import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from '../src/Register&Login/Register.jsx'
import Basic from '../src/Basic/Basic.jsx'
import Panel from '../src/Panel/Panel.jsx'
import Templates from '../src/Templates.jsx'
import Control from '../src/Admin/Control/Control.jsx'
import Message from "../src/Message/Message.jsx";
import Dashboard from '../src/Admin/Dashboard/Dashboard.jsx'
import Groups from '../src/Admin/Groups/Groups.jsx'
import Students from '../src/Admin/Students/Students.jsx'
import StudentDetail from '../src/Admin/Students/StudentDetail.jsx'; 
import "./output.css";

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Register/>}></Route>
            <Route path="/templates" element={<Templates/>}></Route>
            <Route path="/panel" element={<Panel/>}></Route>
            <Route path="/dashboard" element={<Dashboard/>}></Route>
            <Route path="/control" element={<Control/>}></Route>
            <Route path="/chat" element={<Message/>}></Route>
            <Route path="/groups" element={<Groups/>}></Route>
            <Route path="/students" element={<Students/>}></Route>
            <Route path="/student/:id" element={<StudentDetail/>} />
        </Routes>
    </Router>
  )
}

export default App

