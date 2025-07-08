import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  get,
  remove
} from "firebase/database";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from '../src/Register&Login/Register.jsx'
import Basic from '../src/Basic/Basic.jsx'
import Panel from '../src/Panel/Panel.jsx'
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

const firebaseConfig = {
  apiKey: "AIzaSyC94X37bt_vhaq5sFVOB_ANhZPuE6219Vo",
  authDomain: "project-pro-7f7ef.firebaseapp.com",
  databaseURL: "https://project-pro-7f7ef-default-rtdb.firebaseio.com",
  projectId: "project-pro-7f7ef",
  storageBucket: "project-pro-7f7ef.firebasestorage.app",
  messagingSenderId: "782106516432",
  appId: "1:782106516432:web:d4cd4fb8dec8572d2bb7d5",
  measurementId: "G-WV8HFBFPND",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);


function SidebarWrapper({ userData }) {
  const location = useLocation();
  // Faqat /leads bo‘lmaganda SidebarPanel chiqadi
  if (userData && location.pathname !== "/leads") {
    return <SidebarPanel />;
  }
  return null;
}

function App() {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("UserData")))

  const studentData = JSON.parse(localStorage.getItem("StudentData"))

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const systemRef = ref(database, "System/lastDeductedMonth");

    get(systemRef).then(snapshot => {
      const savedMonth = snapshot.val();
      if (savedMonth === null || Number(savedMonth) !== currentMonth) {
        const studentsRef = ref(database, "Students");
        const groupsRef = ref(database, "Groups");
        const coursesRef = ref(database, "Courses");

        Promise.all([
          get(studentsRef),
          get(groupsRef),
          get(coursesRef),
        ]).then(([studentsSnap, groupsSnap, coursesSnap]) => {
          const students = studentsSnap.val() || {};
          const groups = groupsSnap.val() || {};
          const courses = coursesSnap.val() || {};

          const updatePromises = Object.entries(students).map(([studentId, student]) => {
            if (student.status !== "Faol") return Promise.resolve();

            const studentGroup = student.group;
            const matchedGroupEntry = Object.entries(groups).find(
              ([, groupData]) => groupData.groupName && groupData.groupName.toLowerCase() === studentGroup?.toLowerCase()
            );
            if (!matchedGroupEntry) return Promise.resolve();

            const [, matchedGroup] = matchedGroupEntry;
            const coursesArray = Array.isArray(matchedGroup.courses)
              ? matchedGroup.courses
              : matchedGroup.courses
                ? [matchedGroup.courses]
                : [];

            const totalPrice = coursesArray.reduce((sum, courseName) => {
              const matchedCourseEntry = Object.entries(courses).find(
                ([, course]) => course.name && course.name.toLowerCase() === courseName.toLowerCase()
              );
              const price = matchedCourseEntry ? Number(matchedCourseEntry[1].price) : 0;
              return sum + Number(price || 0);
            }, 0);

            const studentRef = ref(database, `Students/${studentId}`);
            return update(studentRef, {
              balance: (Number(student.balance) || 0) - totalPrice,
            });
          });

          Promise.all(updatePromises).then(() => {
            set(systemRef, currentMonth);
          });
        });
      }
    });
  }, []);

  return (
    <>
      <Router>
        <SidebarWrapper userData={userData} />
        <Routes>
          <Route
            path="/"
            element={
              studentData
                ? <Navigate to={`/studentpages/${studentData.id}`} replace />
                : userData
                  ? <Navigate to="/panel" replace />
                  : <Register setUserData={setUserData} />
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
            path="/studentchat"
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

