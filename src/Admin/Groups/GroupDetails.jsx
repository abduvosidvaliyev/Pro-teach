import { useState, useEffect } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import SelectReact from "react-select";
import style from "./Group.module.css";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  remove,
  get
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/UiLabel";
import { Checkbox } from "../../components/ui/checkbox";
import { AddNotify, ChengeNotify } from "../../components/ui/Toast"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "../../components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { CourseSidebar } from "../../components/ui/course-sidebar";
import { Modal } from "../../components/ui/modal"

import { cn } from "../../lib/utils";
import { duration } from "@mui/material";
import { PiArrowUDownLeftBold } from "react-icons/pi";
import { ToastContainer } from "react-toastify";

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

function getLessonTimeRange(startTime, duration) {
  if (!startTime || !duration) return "";

  const [startHour, startMinute] = startTime.split(":").map(Number);

  let durHour = 0, durMinute = 0;
  if (typeof duration === "string" && duration.includes(":")) {
    [durHour, durMinute] = duration.split(":").map(Number);
  } else {
    durMinute = parseInt(duration, 10);
  }

  // Tugash vaqtini hisoblash
  let endHour = startHour + durHour;
  let endMinute = startMinute + durMinute;
  if (endMinute >= 60) {
    endHour += Math.floor(endMinute / 60);
    endMinute = endMinute % 60;
  }

  // Formatlash
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(startHour)}:${pad(startMinute)}-${pad(endHour)}:${pad(endMinute)}`;
}


const days = [
  { value: "Juft kunlar (SPSH)", label: "Juft kunlar (SPSH)" },
  { value: "Toq kunlar (DCHJ)", label: "Toq kunlar (DCHJ)" },
  { value: "Har kuni", label: "Har kuni" },
  { value: "Maxsus kunlar", label: "Maxsus kunlar" },
];

const daysOfWeek = [
  { id: "du", label: "Du" },
  { id: "se", label: "Se" },
  { id: "chor", label: "Chor" },
  { id: "pay", label: "Pay" },
  { id: "ju", label: "Ju" },
  { id: "shan", label: "Shan" },
  { id: "yak", label: "Yak" },
];



const GroupDetails = () => {
  const { id } = useParams(); // URLdan id ni olish
  const navigate = useNavigate(); // useHistory dan foydalaning
  const queryParams = new URLSearchParams(location.search);
  const groupInfoo = JSON.parse(
    decodeURIComponent(queryParams.get("groupInfo"))
  );
  const [groupInfo, setGroupInfo] = useState(groupInfoo);

  const currentMonthYear = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear)

  const [dates, setDates] = useState([]);

  const dayMapping = {
    du: 1, // Dushanba
    se: 2, // Seshanba
    chor: 3, // Chorshanba
    pay: 4, // Payshanba
    ju: 5, // Juma
    shan: 6, // Shanba
    yak: 0, // Yakshanba
  };

  useEffect(() => {
    const generateDates = () => {
      const selectedDays = groupInfo?.selectedDays || [];

      const dateObj = new Date(selectedMonth);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth(); // 0-based

      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const result = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        if (selectedDays.some((d) => dayMapping[d] === dayOfWeek)) {
          result.push(`${day} ${date.toLocaleString("en-US", { month: "short" })}`);
        }
      }

      setDates(result);
    };

    generateDates();

    
  }, [selectedMonth, groupInfo]);

  console.log(selectedMonth)  
  
  const [open, setOpen] = useState(false);
  const [coursesData, setCoursesData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [selectDay, setselectDay] = useState(false);
  const [DeleteModal, setDeleteModal] = useState(false)
  const [LessonTime, setLessonTime] = useState([])
  const [FindCourse, setFindCourse] = useState({})
  const [Course, setCourse] = useState([])
  const [findCourse, setfindCourse] = useState([])

  const [AddGroup, setAddGroup] = useState({
    groupName: "",
    courses: "",
    teachers: "",
    rooms: "",
    duration: "",
    selectedDays: [],
  })
  const [groupChenge, setgroupChenge] = useState({
    groupName: "",
    course: "",
    teachers: "",
    rooms: "",
    duration: "",
    selectedDays: [],
  })

  const [students, setStudents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [LessonStartTime, setLessonStartTime] = useState("")

  useEffect(() => {
    const coursesRef = ref(database, "Teachers");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      setTeachersData(Object.values(data || []));
    });
  }, []);

  useEffect(() => {
    const coursesRef = ref(database, "Courses");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();

      setCoursesData(Object.values(data || {}));
    });
  }, []);

  useEffect(() => {
    const coursesRef = ref(database, "Rooms");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      setRoomsData(Object.values(data || []));
    });
  }, []);

  useEffect(() => {
    const groupsRef = ref(database, "Groups");
    onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      setGroupsData(Object.values(data || []));
    });
  }, []);

  useEffect(() => {
    if (groupInfo) {
      const studentsRef = ref(database, "Students");
      onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        const groupStudents = Object.keys(data)
          .map((key) => data[key])
          .filter((student) => student.group === groupInfo.groupName);

        setStudents(groupStudents);
      });
    }
  }, [groupInfo]); // groupInfo o'zgarganida useEffect qayta ishlaydi


  useEffect(() => {
    const LessonTimeRef = ref(database, "LessonTimes");
    onValue(LessonTimeRef, (snapshot) => {
      const data = snapshot.val();

      setLessonTime(Object.values(data || {}));
    });
  }, [])

  useEffect(() => {
    let selectedDaysValue = groupInfo?.selectedDays;
    if (Array.isArray(selectedDaysValue)) {
      selectedDaysValue = [...selectedDaysValue];
    } else if (typeof selectedDaysValue === "object" && selectedDaysValue?.value) {
      selectedDaysValue = selectedDaysValue.value;
    }
    setgroupChenge({
      groupName: groupInfo?.groupName,
      duration: { value: groupInfo?.duration?.slice(0, 5), label: groupInfo?.duration?.slice(0, 5) },
      course: { value: groupInfo?.courses, label: groupInfo?.courses },
      rooms: { value: groupInfo?.rooms, label: groupInfo?.rooms },
      selectedDays: selectedDaysValue,
      teachers: { value: groupInfo?.teachers, label: groupInfo?.teachers }
    });
  }, [groupInfo])

  const openEditModal = (group) => {
    setIsEditModalOpen(true); // Modalni ochish
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false); // Modalni yopish
  };

  useEffect(() => {
    const isJuft = Array.isArray(groupInfo?.selectedDays) && groupInfo.selectedDays.length === 3 &&
      ["se", "pay", "shan"].every(d => groupInfo.selectedDays.includes(d));
    const isToq = Array.isArray(groupInfo?.selectedDays) && groupInfo.selectedDays.length === 3 &&
      ["du", "chor", "ju"].every(d => groupInfo.selectedDays.includes(d));
    const isHarKuni = Array.isArray(groupInfo?.selectedDays) && groupInfo.selectedDays.length === 7 &&
      ["du", "se", "chor", "pay", "ju", "shan", "yak"].every(d => groupInfo.selectedDays.includes(d));
    if (isJuft || isToq || isHarKuni) {
      setselectDay(true);
    }
  }, [groupInfo])

  // tanlangan guruhni va kursni topish va state ga joylash
  useEffect(() => {
    const groupInfo = groupsData.find(group => group.id === Number(id))

    setGroupInfo(groupInfo)
  }, [groupsData]);


  // guruhga tegishli kursni topish va state ga joylash
  useEffect(() => {
    if (groupInfo && coursesData.length > 0) {
      const course = coursesData.find(course => course.name === groupInfo.courses);

      setCourse(course)
    }
  }, [groupInfo, coursesData]);



  useEffect(() => {
    if (groupChenge.course && groupChenge.course.value && coursesData.length > 0) {
      const dataCourse = coursesData.find(
        course => course.name.toLowerCase() === groupChenge.course.value.toLowerCase()
      );
      setfindCourse(dataCourse);
    }
  }, [groupChenge.course, coursesData])

  // Tanlangan oylardagi talabalar uchun attendance ni tekshirish
  useEffect(() => {
    const now = new Date();
    const currentMonthYear = now.toLocaleString("en-US", { month: "long", year: "numeric" });

    if (!students || students.length === 0) return;

    students.forEach(async (student) => {
      if (!student.attendance || !student.attendance[currentMonthYear]) {
        const studentRef = ref(database, `Students/${student.studentName}`);
        await update(studentRef, {
          [`attendance/${currentMonthYear}`]: {
            _empty: true
          },
        });
      }
    });
  }, [students]);


  const handleAttendance = (studentIndex, dateIndex, student, status) => {
    const newStudents = [...students];
    const date = dates[dateIndex]; // Indeksdan sanani olamiz

    // `attendance`ni yangilash
    if (!newStudents[studentIndex][`attendance`][selectedMonth]) {
      newStudents[studentIndex][`attendance`][selectedMonth] = {};
    }
    newStudents[studentIndex][`attendance`][selectedMonth][date] = status;

    // Firebase'da yangilash
    const studentRef = ref(database, `Students/${student.studentName}`);
    update(studentRef, {
      [`attendance/${selectedMonth}/${date}`]: status,
    }).catch((error) => {
      console.error("Error updating attendance in Firebase:", error);
    });

    setStudents(newStudents);
  };

  useEffect(() => {
    if (AddGroup.courses) {
      const courseFind = coursesData.find((course) => course.name.toLowerCase() === AddGroup.courses.toLowerCase())

      setFindCourse(courseFind)
    }
    else {
      console.log("The course name is incorrect or missing!")
    }
  }, [AddGroup.courses])

  const addGroup = () => {
    if (groupsData.find(group => group.groupName === AddGroup.groupName)) {
      alert("Bunday guruh mavjud");
      return;
    }

    if ((AddGroup.groupName
      && AddGroup.courses
      && LessonStartTime
      && AddGroup.rooms
      && AddGroup.teachers) !== ""
      && AddGroup.selectedDays.length > 0) {

      const lessonTimeRange = getLessonTimeRange(
        LessonStartTime,
        FindCourse?.duration
      );

      const newGroupRef = ref(database, `Groups/${AddGroup.groupName}`);
      set(newGroupRef, {
        ...AddGroup,
        id: groupsData.length + 1,
        duration: lessonTimeRange
      })
        .then(() => {
          setIsAdd(false)
          setAddGroup({
            groupName: "",
            courses: "",
            rooms: "",
            teachers: "",
            selectedDays: []
          })
          setLessonStartTime("")
          AddNotify({ AddTitle: "Guruh qo'shildi!" })
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error adding group to Firebase:", error);
        });
    }
    else {
      alert("Ma'lumotni to'ldiring")
    }
  };

  function handleGroupClick(groupName, id) {
    const groupData = groupsData.find((group) => group.groupName === groupName);
    if (groupData) {
      setGroupInfo(groupData);
      // Fetch students for the selected group
      const studentsRef = ref(database, "Students");
      onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        const groupStudents = Object.keys(data)
          .map((key) => data[key])
          .filter((student) => student.group === groupName);

        setStudents(groupStudents);
      });
      navigate(`/group/${id}`); // Yangi sahifaga o'tish
    }
  }

  const getAttendanceByIndex = (attendance, dates) => {
    const attendanceByIndex = Array(dates.length).fill(null); // Barcha indekslarni `null` bilan to'ldiramiz

    dates.forEach((date, index) => {
      if (attendance[date]) {
        attendanceByIndex[index] = attendance[date]; // Sanaga mos keladigan qiymatni indeksga qo'yamiz
      }
    });

    return attendanceByIndex;
  };

  const handleDayChange = (day) => {
    if (!Array.isArray(groupChenge.selectedDays)) {
      setgroupChenge({ ...groupChenge, selectedDays: [day] });
      return;
    }
    if (groupChenge.selectedDays.includes(day)) {
      setgroupChenge({
        ...groupChenge,
        selectedDays: groupChenge.selectedDays.filter(d => d !== day)
      });
    } else {
      setgroupChenge({
        ...groupChenge,
        selectedDays: [...groupChenge.selectedDays, day]
      });
    }
  };


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleGroupUpdate = async () => {
    if (groupsData.find(group => group.groupName === groupChenge.groupName)) {
      alert("Bunday guruh mavjud");
      return;
    }

    const groupAbout = {
      groupName: groupChenge.groupName,
      courses: groupChenge.course.value,
      rooms: groupChenge.rooms.value,
      teachers: groupChenge.teachers.value,
      selectedDays: groupChenge.selectedDays
    }
    if ((groupChenge.course.value
      && groupChenge.duration.value
      && groupChenge.groupName.value
      && groupChenge.rooms.value
      && groupChenge.teachers.value) !== ""
      && groupChenge.selectedDays.length > 0) {

      const lessonTimeRange = getLessonTimeRange(
        groupChenge.duration.value,
        findCourse?.duration
      );

      const oldKey = groupInfo?.groupName;
      const newKey = groupChenge.groupName;

      try {
        if (oldKey === newKey) {
          // Faqat qiymatlarni yangilash
          await update(ref(database, `Groups/${oldKey}`), { ...groupAbout, duration: lessonTimeRange });
        } else {
          // Eski key ostidagi ma'lumotlarni olib, yangi keyga yozish
          const oldRef = ref(database, `Groups/${oldKey}`);
          const snapshot = await get(oldRef);

          if (!snapshot.exists()) throw new Error("Eski guruh topilmadi");

          const newRef = ref(database, `Groups/${newKey}`);

          await set(newRef, { ...groupAbout, duration: lessonTimeRange, id: groupInfo?.id });

          const studentsRef = ref(database, "Students");
          const studentsSnap = await get(studentsRef);
          if (studentsSnap.exists()) {
            const studentsData = studentsSnap.val();
            const updates = {};
            Object.keys(studentsData).forEach((studentKey) => {
              if (studentsData[studentKey].group === oldKey) {
                updates[`${studentKey}/group`] = newKey;
              }
            });
            if (Object.keys(updates).length > 0) {
              await update(studentsRef, updates);
            }
          }

          await remove(oldRef);
        }

        setIsEditModalOpen(false);
        ChengeNotify({ ChengeTitle: "Ma'lumot o'zgartirildi" });
        setgroupChenge({
          groupName: "",
          course: "",
          rooms: "",
          teachers: "",
          selectedDays: []
        });
      } catch (error) {
        console.error("O'quvchi ma'lumotlarini yangilashda xatolik:", error);
      }
    }
    else {
      alert("Ma'lumotni to'ldiring");
    }
  }

  const handleSelectDays = (value) => {
    value === "Juft kunlar (SPSH)" ? setAddGroup({ ...AddGroup, selectedDays: ["se", "pay", "shan"] }) :
      value === "Toq kunlar (DCHJ)" ? setAddGroup({ ...AddGroup, selectedDays: ["du", "chor", "ju"] }) :
        value === "Har kuni" ? setAddGroup({ ...AddGroup, selectedDays: ["du", "se", "chor", "pay", "ju", "shan", "yak"] }) :
          value === "Maxsus kunlar" ? setAddGroup({ ...AddGroup, selectedDays: "Maxsus kunlar" }) : null
  }

  const handleChangeSelectDays = (value) => {
    if (value === "Juft kunlar (SPSH)") {
      setgroupChenge({ ...groupChenge, selectedDays: ["se", "pay", "shan"] });
    } else if (value === "Toq kunlar (DCHJ)") {
      setgroupChenge({ ...groupChenge, selectedDays: ["du", "chor", "ju"] });
    } else if (value === "Har kuni") {
      setgroupChenge({ ...groupChenge, selectedDays: ["du", "se", "chor", "pay", "ju", "shan", "yak"] });
    } else if (value === "Maxsus kunlar") {
      setgroupChenge({ ...groupChenge, selectedDays: [] });
      setselectDay(true);
    }
  }

  const getDaysSelectValue = (selectedDays) => {
    if (!selectedDays) return null;
    if (Array.isArray(selectedDays)) {
      if (
        selectedDays.length === 3 &&
        selectedDays.includes("se") &&
        selectedDays.includes("pay") &&
        selectedDays.includes("shan")
      ) {
        return { value: "Juft kunlar (SPSH)", label: "Juft kunlar (SPSH)" };
      }
      if (
        selectedDays.length === 3 &&
        selectedDays.includes("du") &&
        selectedDays.includes("chor") &&
        selectedDays.includes("ju")
      ) {
        return { value: "Toq kunlar (DCHJ)", label: "Toq kunlar (DCHJ)" };
      }
      if (
        selectedDays.length === 7 &&
        ["du", "se", "chor", "pay", "ju", "shan", "yak"].every(d => selectedDays.includes(d))
      ) {
        return { value: "Har kuni", label: "Har kuni" };
      }
      return { value: "Maxsus kunlar", label: "Maxsus kunlar" };
    }
    if (selectedDays === "Maxsus kunlar") {
      return { value: "Maxsus kunlar", label: "Maxsus kunlar" };
    }
    return null;
  }

  const handleDeleteGroup = () => {
    if (groupInfo?.groupName) {
      const removeGroupRef = ref(database, `Groups/${groupInfo?.groupName}`);

      remove(removeGroupRef)
        .then(() => {
          setDeleteModal(false);
          navigate("/groups");
          DeleteModal({ DeleteTitle: "Guruh o'chirildi!" });
        })
        .catch(error => {
          console.error(error)
        })
    }
    else {
      console.log("Group name is not defined or invalid.");
    }
  }

  const firstStudent = students[0];

  if (!groupInfo) {
    return <div
      style={{
        marginLeft: "var(--sidebar-width, 250px)",
        width: "var(--sidebar-width), 100%",
        transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
      }}
    >
      Loading...
    </div>;
  }

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
  }

  return (
    <div>
      {
        DeleteModal && (
          <Modal
            title="Siz ushbu guruhni o'chirishni xohlaysizmi?"
            isOpen={DeleteModal}
            onClose={() => setDeleteModal(false)}
            positionTop="top-[40%]"
            children={
              <div className="flex justify-center gap-5">
                <Button
                  variant="red"
                  className="px-8 text-base"
                  onClick={handleDeleteGroup}
                >
                  Ha
                </Button>
                <Button
                  variant="outline"
                  className="px-8 text-base"
                  onClick={() => setDeleteModal(false)}
                >
                  Yo'q
                </Button>
              </div>
            }
          />
        )
      }

      <ToastContainer />
      <div
        className={style.main}
        style={{
          marginLeft: "var(--sidebar-width, 250px)",
          width: "var(--sidebar-width), 100%",
          transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
        }}
      >
        <div className={style.menu}>
          <h1>Guruhlar: </h1>
          <div className={style.groups}>
            {groupsData.map((group, index) => (
              <span
                key={index}
                onClick={() => handleGroupClick(group.groupName, group.id)}
              >
                {group.groupName}
              </span>
            ))}
          </div>
        </div>
        <div className={style.groupAbout}>
          <h2>Guruhlar soni: {groupsData.length}</h2>
          <SidebarProvider>
            {isOpen && (
              <div
                className="fixed w-full h-[100vh] z-30  inset-0 backdrop-blur-[2px] bg-black/50 transition-all duration-900 ease-in-out"
                onClick={() => {
                  setOpen(false);
                  toggleSidebar();
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
                <h2 className="text-xl font-semibold">Yangi guruh qo'shish</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setOpen(false);
                    toggleSidebar();
                  }}
                  className="rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5  " />
                  <span className="sr-only">Yopish</span>
                </Button>
              </SidebarHeader>

              <SidebarContent>
                <form
                  className="space-y-6 p-6 text-left "
                >
                  <div className="space-y-6">
                    <Label htmlFor="courseName">Guruh nomi</Label>
                    <Input
                      id="courseName"
                      placeholder="Guruh nomini kiriting"
                      className={`w-full ${style.inputSearch}`}
                      onChange={(e) => setAddGroup({ ...AddGroup, groupName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseSelect">Kursni tanlash</Label>
                    <SelectReact
                      onChange={(e) => setAddGroup({ ...AddGroup, courses: e.value })}
                      options={coursesData.map((course) => ({ value: course.name, label: course.name }))}
                      placeholder="Kursni tanlang"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher">O'qituvchi</Label>
                    <SelectReact
                      onChange={(e) => setAddGroup({ ...AddGroup, teachers: e.value })}
                      options={teachersData.map((teacher) => ({ value: teacher.name, label: teacher.name }))}
                      placeholder="O'qitchini tanlang"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Dars kunlari</Label>
                    <div className="flex flex-wrap gap-3">
                      {AddGroup.selectedDays !== "Maxsus kunlar" ? <SelectReact
                        className="w-full"
                        placeholder="Dars kunlarini tanlang"
                        options={days.map((day) => ({ value: day.value, label: day.label }))}
                        onChange={(e) => handleSelectDays(e.value)}
                      /> :
                        <div className="w-full flex justify-start flex-col gap-3">
                          <div
                            className="cursor-pointer w-[30px] h-[30px] rounded-full hover:bg-gray-200 flex justify-center items-center"
                            onClick={() => {
                              setAddGroup({ ...AddGroup, selectedDays: [] });
                            }}
                          >
                            <PiArrowUDownLeftBold className="text-lg" />
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {
                              daysOfWeek.map((day) => (
                                <div
                                  key={day.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={day.id}
                                    onCheckedChange={() => handleDayChange(day.id)}
                                  />
                                  <Label
                                    htmlFor={day.id}
                                    className="text-sm font-normal cursor-pointer"
                                  >
                                    {day.label}
                                  </Label>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Dars vaqti</Label>
                    <SelectReact
                      placeholder="Dars vaqti tanlang"
                      className="w-full"
                      onChange={(e) => setLessonStartTime(e.value)}
                      options={LessonTime.map((time) => ({ value: time, label: time }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Xona</Label>
                    <SelectReact
                      onChange={(e) => setAddGroup({ ...AddGroup, rooms: e.value })}
                      options={roomsData.map((room) => ({ value: room.name, label: room.name }))}
                      placeholder="Xona tanlang"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-blue-800 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      addGroup();
                    }}
                  >
                    Qo'shish
                  </Button>
                </form>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
          <Button
            className={style.groupAddButton}
            onClick={() => {
              setOpen(true);
              toggleSidebar();
            }}
          >
            Guruh qo'shish
          </Button>
        </div>
        <Card className="col-[1/4] row-[4/11] border-slate-200 rounded-[5px]">
          {groupInfo && (
            <>
              <CardHeader className="border-b pb-4">
                <CardTitle>{groupInfo.groupName}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kurs:</span>
                      <span className="font-medium">
                        {groupInfo.courses
                          ? groupInfo.courses
                          : "No course selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">O'qituvchi:</span>
                      <span className="font-medium">
                        {groupInfo.teachers
                          ? groupInfo.teachers
                          : "No teacher selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Narx:</span>
                      <span className="font-medium">
                        {Course && Course.price
                          ? `${new Intl.NumberFormat(("uz-UZ")).format(Course.price)} so'm`
                          : "No'malum"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dars vaqti:</span>
                      <span className="font-medium">
                        {duration
                          ? `${groupInfo.duration}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dars kunlari:</span>
                      <span className="font-medium capitalize">
                        {
                          groupInfo?.selectedDays && Array.isArray(groupInfo.selectedDays)
                            ? groupInfo.selectedDays.join(", ")
                            : "No days selected"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room:</span>
                      <span className="font-medium">
                        {groupInfo.rooms ? groupInfo.rooms : "No room selected"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full text-orange-500 border-orange-500 hover:bg-orange-50"
                      onClick={() => openEditModal(groupInfo)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full text-red-500 border-red-500 hover:bg-red-50"
                      onClick={() => setDeleteModal(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                    <CourseSidebar groupInfo={groupInfo} />
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        <div className={`${style.davomat} flex flex-col gap-3`}>
          <h1>Davomat</h1>
          <Select
            defaultValue={currentMonthYear}
            onValueChange={(e) => setSelectedMonth(e)}
          >
            <SelectTrigger className="w-[120px] capitalize">
              <SelectValue placeholder={`${currentMonthYear}`} />
            </SelectTrigger>
            <SelectContent>
              {
                firstStudent && firstStudent.attendance && Object.keys(firstStudent.attendance).map((month, index) => (
                  <SelectItem
                    key={index}
                    value={month}
                    className="capitalize"
                  >
                    {month}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>

          <div className={style.attendanceGrid}>
            <div className={style.header}>
              <div className={style.nameCol}>Ism</div>
              {dates.map((date, index) => (
                <div key={index} className={style.dateCol}>
                  {date}
                </div>
              ))}
            </div>

            {students.map((student, studentIndex) => {
              // Tanlangan oy uchun `attendance` ma'lumotlarini tekshirish
              const attendanceData = student[`attendance`]?.[selectedMonth];
              if (!attendanceData) {
                return (
                  <div key={studentIndex} className={style.studentCol}>
                    <div className={`${style.nameCol} capitalize`}>
                      <h2
                        className="border-b border-b-transparent hover:border-b hover:border-blue-600 hover:text-blue-600 cursor-pointer transition-all"
                        onClick={() => navigate(`/student/${student.id}`)}
                      >
                        {student.studentName}
                      </h2>
                    </div>
                    <div className={style.dateCol} colSpan={dates.length}>
                      <span className="text-red-500">Not Found</span>
                    </div>
                  </div>
                );
              }

              const status = student.status !== "Faol";
              if (status) {
                return (
                  <div key={studentIndex} className={style.studentCol}>
                    <div className={`${style.nameCol} capitalize`}>
                      <h2
                        className="border-b border-b-transparent hover:border-b hover:border-blue-600 hover:text-blue-600 cursor-pointer transition-all"
                        onClick={() => navigate(`/student/${student.id}`)}
                      >
                        {student.studentName}
                      </h2>
                    </div>
                    <div className="w-7/12">
                      <h2 className="text-gray-500 text-center">Bu hisob nofaol yoki muzlatilgan!</h2>
                    </div>
                  </div>
                );
              }

              const attendanceByIndex = getAttendanceByIndex(attendanceData, dates);

              return (
                <div key={studentIndex} className={style.studentCol}>
                  <div className={`${style.nameCol} capitalize`}>
                    <h2
                      className="border-b border-b-transparent hover:border-b hover:border-blue-600 hover:text-blue-600 cursor-pointer transition-all"
                      onClick={() => navigate(`/student/${student.id}`)}
                    >
                      {student.studentName}
                    </h2>
                  </div>

                  {attendanceByIndex.map((attendance, dateIndex) => {
                    const currentDate = dates[dateIndex];
                    const today = `${new Date().getDate()} ${new Date().toLocaleString("en-US", { month: "short", })}`;
                    const isPastDate = new Date(currentDate) < new Date(today);
                    const isNotToday = currentDate !== today;

                    return (
                      <div key={dateIndex} className={style.attendanceCell}>
                        <div
                          className={`${style.circle} ${attendance === true
                            ? style.present
                            : attendance === false
                              ? style.absent
                              : ""
                            }`}
                        >
                          <div className={style.hoverButtons}>
                            <button
                              className={style.yesBtn}
                              onClick={() =>
                                handleAttendance(studentIndex, dateIndex, student, true)
                              }
                            // disabled={isPastDate || isNotToday}
                            >
                              Ha
                            </button>
                            <button
                              className={style.noBtn}
                              onClick={() =>
                                handleAttendance(studentIndex, dateIndex, student, false)
                              }
                            // disabled={isPastDate || isNotToday}
                            >
                              Yo'q
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>
      </div>
      <div>
        {isEditModalOpen && (

          <div
            className="fixed w-full  h-[100vh] z-30 bg-black/50 inset-0 backdrop-blur-[2px] transition-all duration-900 ease-in-out"
            onClick={() => {
              closeEditModal()
            }}
          ></div>
        )}

        {/* Modalning o'ngdan chiqishi */}
        <Sidebar
          className={cn(
            "fixed inset-y-0 right-0 z-50 w-[400px] border-l border-gray-300 bg-white transition-transform duration-300 ease-in-out",
            isEditModalOpen ? "translate-x-0" : "translate-x-full"
          )}
          side="right"
          collapsible="none"
        >
          <SidebarHeader className="flex items-center justify-between border-b border-gray-300 p-4">
            <h2 className="text-xl font-semibold">Guruhni tahrirlash</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeEditModal}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Yopish</span>
            </Button>
          </SidebarHeader>

          <SidebarContent>
            <form className="space-y-6 p-6 text-left">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editGroupName">Guruh nomi</Label>
                  <Input
                    id="editGroupName"
                    placeholder="Guruh nomini kiriting"
                    value={groupChenge.groupName}
                    onChange={e => setgroupChenge(gc => ({ ...gc, groupName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editCourse">Kursni tanlash</Label>
                  <SelectReact
                    value={groupChenge.course}
                    onChange={e => setgroupChenge(gc => ({ ...gc, course: e }))}
                    options={coursesData.map(course => ({ value: course.name, label: course.name }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editTeacher">O'qituvchi</Label>
                  <SelectReact
                    value={groupChenge.teachers}
                    onChange={e => setgroupChenge(gc => ({ ...gc, teachers: e }))}
                    options={teachersData.map(teacher => ({ value: teacher.name, label: teacher.name }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editRoom">Xona</Label>
                  <SelectReact
                    value={groupChenge.rooms}
                    onChange={e => setgroupChenge(gc => ({ ...gc, rooms: e }))}
                    options={roomsData.map(room => ({ value: room.name, label: room.name }))}
                  />
                </div>
                <div>
                  <Label>Dars vaqti</Label>
                  <SelectReact
                    value={groupChenge.duration}
                    onChange={e => setgroupChenge(gc => ({ ...gc, duration: e }))}
                    options={LessonTime.map(time => ({ value: time, label: time }))}
                  />
                </div>
                <div>
                  <Label>Dars kunlari</Label>
                  {
                    !selectDay ? (
                      <SelectReact
                        value={getDaysSelectValue(groupChenge.selectedDays)}
                        onChange={e => handleChangeSelectDays(e.value)}
                        options={days.map(day => ({ value: day.label, label: day.label }))}
                      />
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div
                          className="cursor-pointer w-[30px] h-[30px] rounded-full hover:bg-gray-200 flex justify-center items-center"
                          onClick={() => { setgroupChenge(gc => ({ ...gc, selectedDays: groupInfo?.selectedDays })); setselectDay(false); }}
                        >
                          <PiArrowUDownLeftBold className="text-lg" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {
                            daysOfWeek.map((day) => (
                              <div key={day.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={day.id}
                                  checked={Array.isArray(groupChenge.selectedDays) && groupChenge.selectedDays.includes(day.id)}
                                  onCheckedChange={() => handleDayChange(day.id)}
                                />
                                <Label
                                  htmlFor={day.id}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {day.label}
                                </Label>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={closeEditModal}
                  className="text-gray-600"
                >
                  Bekor qilish
                </Button>
                <Button onClick={(e) => { e.preventDefault(), handleGroupUpdate() }} className="bg-blue-800 text-white">
                  Saqlash
                </Button>
              </div>
            </form>
          </SidebarContent>
        </Sidebar>
      </div>
    </div>
  );
}

export default GroupDetails;