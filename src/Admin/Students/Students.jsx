"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import style from "./Students.module.css";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { SidebarPanel } from "../../Sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  MoreVertical,
  FileSpreadsheet,
  MessageSquare,
  Plus,
  ChevronDown,
} from "lucide-react";
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

function Students() {
  const navigate = useNavigate();

  const getCurrentMonth = () => {
    const now = new Date();
    const currentMonthAndYear = now.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    return currentMonthAndYear;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [isAdd, setIsAdd] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [studentInfo, setStudentInfo] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentNumber, setNewStudentNumber] = useState();
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [dates, setDates] = useState(getCurrentDate());
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [courses, setCourses] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    course: "",
    groupStatus: "",
    paymentStatus: "",
    group: "",
    teacher: "",
  });
  const [groupsData, setGroupsData] = useState(null);

  const toggleIsAdd = () => {
    setIsAdd(!isAdd);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setNewStudentName(value);
    setSelectedOptions((prevState) => ({
      ...prevState,
      studentName: value,
    }));
  };

  const handleInputChangeNum = (event) => {
    const value = event.target.value;
    setNewStudentNumber(value);
    setSelectedOptions((prevState) => ({
      ...prevState,
      studentNumber: value,
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const studentsRef = ref(database, "Students");
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      setStudentsData(data ? Object.values(data) : []);
    });
  }, []);

  useEffect(() => {
    const studentsRef = ref(database, `Payments/${currentMonth}`);
    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      setPaymentHistory(data ? Object.values(data) : []);
      console.log(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const groupsRef = ref(database, `Groups`);
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      setGroupsData(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const teachersRef = ref(database, `Teachers`);
    const unsubscribe = onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      setTeachersData(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const coursesRef = ref(database, `Courses`);
    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      setCourses(data);
    });

    return () => unsubscribe();
  }, []);

  function addStudent() {
    if (newStudentName.trim() !== "") {
      const newStudent = {
        ...selectedOptions,
        studentName: newStudentName,
        id: studentsData.length + 1,
        group: "",
        attendance: {
          [currentMonth]: Array(dates.length).fill(false),
        },
        balance: ""
      };

      setStudents([...students, newStudentName]);
      setStudents([...students, newStudentNumber]);
      setStudentsData([...studentsData, newStudent]);

      const newStudentRef = ref(database, `Students/${newStudentName}`);
      set(newStudentRef, newStudent)
        .then(() => {
          console.log("Student added to Firebase:", newStudent);
        })
        .catch((error) => {
          console.error("Error adding student to Firebase:", error);
        });

      setNewStudentName("");
      setNewStudentNumber("");
    }
    console.log(studentsData);
  }

  const handleRowClick = (student) => {
    setSelectedStudentName(student.studentName);
    setIsModalOpen(true);
  };

  const handleLinkClick = (event, student, studentId, studentName) => {
    console.log(student);
    event.stopPropagation();
    setStudentInfo(studentName);
    navigate(`/student/${studentId}`, { state: { student: student } });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudentName("");
  };

  const filteredStudents = studentsData.filter((student) => {
    // Talabaning guruhini olish
    const group = student.group;
    
    // Guruhning kursini olish
    const course =
      groupsData && group && groupsData[group]?.courses
        ? groupsData[group].courses
        : "";
  
    return (
      student.studentName.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.course === "" || (Array.isArray(course) ? course.includes(filters.course) : course === filters.course)) &&
      (filters.groupStatus === "" || student.groupStatus === filters.groupStatus) &&
      (filters.paymentStatus === "" || student.paymentStatus === filters.paymentStatus) &&
      (filters.group === "" || student.group === filters.group) &&
      (filters.teacher === "" || 
        (groupsData && group && groupsData[group]?.teachers === filters.teacher))
    );
  });
  

  

  return (
    <div>
      <SidebarPanel />
      <div
        className={style.main}
        style={{
          marginLeft: "var(--sidebar-width, 250px)",
          width: "var(--sidebar-width), 100%",
          transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
        }}
      >
        <div className={style.studentAbout}>
          <h2>Talabalar soni: {studentsData.length}</h2>
          <div className={`${style.studentAdd} ${isAdd ? style.isAdd : ""}`}>
            <span>
              <h2>Yangi talaba qo'shish</h2>
              <button onClick={toggleIsAdd}>❌</button>
            </span>
            <hr />
            <label htmlFor="">Telefon</label>
            <input type="text" onChange={handleInputChangeNum} />
            <label htmlFor="">Ismi</label>
            <input
              type="text"
              value={newStudentName}
              onChange={handleInputChange}
            />
            <label htmlFor="">Tug'ilgan sana</label>
            <input type="date" name="" id="" />

            <button onClick={addStudent}>Saqlash</button>
          </div>
          <Button
            onClick={toggleIsAdd}
            className="gap-2 bg-black text-white hover:opacity-80 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            YANGI QO'SHISH
          </Button>
        </div>
        <div className={style.students}>
          <div className="p-6 col-[1/11]">
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Qidirish"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>

              {/* Courses Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {filters.course || "Kurslar"}{" "}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("course", "")}
                  >
                    Barchasi
                  </DropdownMenuItem>
                  {courses && Object.keys(courses).length > 0 ? (
                    Object.values(courses).map((course, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() =>
                          handleFilterChange("course", course.name)
                        }
                      >
                        {course.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No courses available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Group Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {filters.groupStatus || "Guruhdagi holati"}{" "}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("groupStatus", "")}
                  >
                    Barchasi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("groupStatus", "Faol")}
                  >
                    Faol
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleFilterChange("groupStatus", "Nofaol")
                    }
                  >
                    Nofaol
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Payment Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {filters.paymentStatus || "To'lov holati"}{" "}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("paymentStatus", "")}
                  >
                    Barchasi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleFilterChange("paymentStatus", "To'langan")
                    }
                  >
                    To'langan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleFilterChange("paymentStatus", "To'lanmagan")
                    }
                  >
                    To'lanmagan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Teacher Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {filters.teacher || "Ustoz"}{" "}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("teacher", "")}
                  >
                    Barchasi
                  </DropdownMenuItem>
                  {teachersData && Object.keys(teachersData).length > 0 ? (
                    Object.values(teachersData).map((teacher, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() =>
                          handleFilterChange("teacher", teacher.name)
                        }
                      >
                        {teacher.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No teachers available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  className="gap-2 hover:bg-[#0000001b] cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  EXCEL
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 hover:bg-[#0000001b] cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  SMS YUBORISH
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ism familiya</TableHead>
                  <TableHead>Baho</TableHead>
                  <TableHead>Telefon raqam</TableHead>
                  <TableHead>Guruhlar</TableHead>
                  <TableHead>O'qituvchi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow
                    onClick={(event) =>
                      handleLinkClick(
                        event,
                        student,
                        student.id,
                        student.studentName
                      )
                    }
                    key={student.id}
                  >
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.studentNumber}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {student.group}
                      </span>
                    </TableCell>
                    <TableCell>
                      {groupsData &&
                      student.group &&
                      groupsData[student.group]?.teachers
                        ? groupsData[student.group].teachers
                        : "Ma'lumot yo'q"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Students;