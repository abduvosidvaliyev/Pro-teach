"use client";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  get
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "./sidebar";
import { Button } from "./button";
import { Input } from "./input";

import { Label } from "./UiLabel";
import { cn } from "../../lib/utils";
import SelectReact from "react-select"
import style from "../../Sidebar.module.css";
import { AddNotify } from "./Toast";

const getCurrentMonth = () => {
  const now = new Date();
  const currentMonthAndYear = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  return currentMonthAndYear;
};

export const CourseSidebar = ({ groupInfo }) => {
  const [Leads, setLeads] = useState([])
  const [Students, setStudents] = useState([])
  const [firstLead, setFirstLead] = useState({})
  const [Course, setCourse] = useState([])
  const [firstCourse, setFirstCourse] = useState({})
  const [open, setOpen] = useState(false);
  const [AddStudent, setAddStudent] = useState({
    studentName: "",
    login: "",
    parol: ""
  })

  useEffect(() => {
    const LeadsRef = ref(database, "leads")

    onValue(LeadsRef, (snapshot) => {
      const data = snapshot.val();
      setLeads(Object.values(data || {}))
    });

    const StudentsRef = ref(database, "Students");
    onValue(StudentsRef, (snapshot) => {
      const data = snapshot.val();

      setStudents(Object.values(data || {}));
    });

    const CourseRef = ref(database, "Courses");
    onValue(CourseRef, (snapshot) => {
      const data = snapshot.val();

      setCourse(Object.values(data || {}));
    });
  }, []);

  useEffect(() => {
    const lead = Leads.find((lead) => lead.name === AddStudent.studentName);

    setFirstLead(lead || {});
  }, [AddStudent.studentName, Leads]);

  useEffect(() => {
    const course = Course.find(course => course.name === groupInfo?.courses)

    setFirstCourse(course || {});
  }, [groupInfo?.courses, Course]);

  const handleStatusChenge = (name) => {
    const studentRef = ref(database, `leads/${name}`)

    update(studentRef, { status: "O'qiyabdi" })
  }

  const addStudent = () => {
    if ((AddStudent.studentName) === "") {
      alert("Ma'lumotlarni to'ldiring");
      return
    }

    const date = new Date().toISOString().split("T")[0];

    // Guruh ma'lumotlarini olish
    const groupRef = ref(database, `Groups/${groupInfo?.groupName}`);
    get(groupRef)
      .then((groupSnapshot) => {
        if (groupSnapshot.exists()) {
          const currentMonth = getCurrentMonth();

          // Studentni Firebase-ga qo'shish
          set(ref(database, `Students/${AddStudent.studentName}`), {
            attendance: {
              [currentMonth]: {
                _empty: true,
              },
            },
            id: Students.length + 1,
            balance: 0,
            group: groupInfo?.groupName,
            studentName: AddStudent.studentName,
            studentNumber: firstLead.phone,
            image: "",
            login: AddStudent.login,
            parol: AddStudent.parol,
            status: "Faol",
            ball: 0,
            addedDate: date,
            studentHistory: [
              {
                date: date,
                title: "Ro'yxatdan o'tdi",
                description: `${AddStudent.studentName} ${groupInfo?.groupName} guruhiga qo'shildi.`,
              },
            ],
            paymentHistory: []
          })
            .then(() => {
              setOpen(false);
              handleStatusChenge(firstLead.name)
              setAddStudent({
                studentName: "",
                login: "",
                parol: ""
              })
              AddNotify({ AddTitle: "O'quvchi qo'shildi" })
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          alert("Guruh topilmadi");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <SidebarProvider>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        className=" h-10 w-10 rounded-full p-0 border border-blue-500 bg-white hover:bg-blue-50"
        variant="outline"
      >
        <Plus className="h-5 w-5 text-blue-500" />
        <span className="sr-only">Guruhga yangi o'quvchi qo'shish</span>
      </Button>
      {open && (
        <div
          className="fixed w-full  h-[100vh] z-30 bg-black/50 inset-0 backdrop-blur-[2px] transition-all duration-900 ease-in-out"
          onClick={() => {
            setOpen(false);
          }}
        ></div>
      )}
      <Sidebar
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[400px] border-l border-gray-300 bg-white transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        side="right"
        collapsible="none"
      >
        <SidebarHeader className="flex  items-center justify-between border border-gray-300 p-4">
          <h2 className="text-xl font-semibold">Guruhga yangi o'quvchi qo'shish</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setOpen(false);
            }}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5  " />
            <span className="sr-only">Yopish</span>
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <form className="space-y-6 p-6 text-left ">
            <div className="space-y-6">
              <Label htmlFor="studentName">O'quvchi</Label>
              <SelectReact
                id="studentName"
                placeholder="O'quvchini tanlang..."
                options={Leads.map((lead) => ({ value: lead.name, label: lead.name }))}
                className="w-full"
                onChange={(e) => setAddStudent({ ...AddStudent, studentName: e.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                placeholder="Loginni kiriting"
                className={style.input}
                onChange={(e) => setAddStudent({ ...AddStudent, login: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="parol">Parol</Label>
              <Input
                id="parol"
                type="password"
                placeholder="Parolni kiriting"
                className={style.input}
                onChange={(e) => setAddStudent({ ...AddStudent, parol: e.target.value })}
              />
            </div>

            <Button
              onClick={(e) => (e.preventDefault(), addStudent())}
              className="bg-blue-800 text-white"
            >
              Qo'shish
            </Button>
          </form>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
