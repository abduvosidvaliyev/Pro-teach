import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from '../src/Register&Login/Register.jsx'
import Basic from '../src/Basic/Basic.jsx'
import Panel from '../src/Panel/Panel.jsx'
import Templates from '../src/Templates.jsx'
import Control from '../src/Admin/Control/Control.jsx'
import Message from "../src/Message/Message.jsx";
import Expenses from '../src/Admin/Dashboard/Expenses.jsx'
import Groups from '../src/Admin/Groups/Groups.jsx'
import Students from '../src/Admin/Students/Students.jsx'
import StudentDetail from '../src/Admin/Students/StudentDetail.jsx';
import GroupDetails from "../src/Admin/Groups/GroupDetails.jsx";
import Leads from "../src/Panel/Leads.jsx"
import "./index.css";
import Course from "./Admin/Course/Course.jsx";
import CourseInfo from "./Admin/Course/CourseInfo.jsx";
import Rooms from "./Admin/Rooms/Rooms.jsx";
import Users from "./Admin/Users/Users.jsx";
import UserInfo from "./Admin/Users/UserInfo.jsx";
import PaymentArchive from "./Admin/PaymentArchive/PaymentArchive.jsx";
import DebtadStudents from "./Admin/DebtadStudents/DebtadStudents.jsx";
import InputAndOutput from "./Admin/Dashboard/InputAndOutput.jsx";
import "./Panel/Toast.css"
import { PrivateRoute, PrivateStudentRoute } from "./Register&Login/PrivateRoute.jsx";
import { Profile } from "./Admin/Profile/Profile.jsx";
import { SidebarPanel } from "./Sidebar.jsx";

function App() {
  const [userData, setUserData] = useState(localStorage.getItem("UserData"))

  const studentData = localStorage.getItem("StudentData")

  return (
    <>
      <Router>
        {userData && <SidebarPanel />}
        <Routes>
          <Route
            path="/"
            element={
              studentData
                ? <Navigate to={`/studentpages/${studentData.id}`} replace />
                : userData
                  ? <Navigate to="/panel" replace />
                  : <Register setUserData={setUserData}/>
            }
          />
          <Route
            path="/studentpages/:id"
            element={
              <PrivateStudentRoute >
                <Basic />
              </PrivateStudentRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateStudentRoute>
                <Message />
              </PrivateStudentRoute>
            }
          />
          <Route element={<PrivateRoute />}>
            <Route path="/panel" element={<Panel setUserData={setUserData} />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/inputAndOutput" element={<InputAndOutput />} />
            <Route path="/chat" element={<Message />} />
            <Route path="/control" element={<Control />} />
            <Route path="/course" element={<Course />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/users" element={<Users />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/students" element={<Students />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/paymentArchive" element={<PaymentArchive />} />
            <Route path="/debtadStudents" element={<DebtadStudents />} />
            <Route path="/student/:id" element={<StudentDetail />} />
            <Route path="/group/:id" element={<GroupDetails />} />
            <Route path="/course/:id" element={<CourseInfo />} />
            <Route path="/users/:id" element={<UserInfo />} />
            <Route path="/admin/:id" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

