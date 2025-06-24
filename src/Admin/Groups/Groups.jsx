import React, { useState, useEffect } from "react";
import SelectReact from "react-select";
import { data, Link, useNavigate } from "react-router-dom";
import style from "./Group.module.css";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  push,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "../../components/ui/sidebar";
import {
  Check,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "../../components/ui/UiLabel";
import { Checkbox } from "../../components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { cn } from "../../lib/utils";
import { PiArrowUDownLeftBold } from "react-icons/pi";
import { AddNotify } from "../../components/ui/Toast"
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

// Dars vaqtini hisoblash funksiyasi
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
  { label: "Juft kunlar (SPSH)" },
  { label: "Toq kunlar (DCHJ)" },
  { label: "Har kuni" },
  { label: "Maxsus kunlar" },
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

const teachers = [
  { value: "umarxon", label: "Umarxon" },
  { value: "abror", label: "Abror" },
  { value: "sardor", label: "Sardor" },
  { value: "dilshod", label: "Dilshod" },
]

const rooms = [
  { value: "1", label: "1-xona" },
  { value: "2", label: "2-xona" },
  { value: "3", label: "3-xona" },
  { value: "4", label: "4-xona" },
]

const weekDays = [
  { id: "monday", label: "Du" },
  { id: "tuesday", label: "Se" },
  { id: "wednesday", label: "Chor" },
  { id: "thursday", label: "Pay" },
  { id: "friday", label: "Ju" },
  { id: "saturday", label: "Shan" },
  { id: "sunday", label: "Yak" },
]

function Groups() {
  const navigate = useNavigate();

  const [openTeacher, setOpenTeacher] = React.useState(false)
  const [valueTeacher, setValueTeacher] = React.useState("")
  const [open, setOpen] = useState(false);
  const [openRoom, setOpenRoom] = React.useState(false)
  const [valueRoom, setValueRoom] = React.useState("")
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [groupInfo, setGroupInfo] = useState();
  const [groupsData, setGroupsData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [LessonTime, setLessonTime] = useState([])
  const [FindCourse, setFindCourse] = useState({})
  const [LessonStartTime, setLessonStartTime] = useState("")

  const [AddGroup, setAddGroup] = useState({
    groupName: "",
    courses: "",
    teachers: "",
    rooms: "",
    selectedDays: [],
  })

  useEffect(() => {
    const coursesRef = ref(database, "Teachers");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();

      setTeachersData(Object.values(data || []));
    });
  }, []);

  useEffect(() => {
    const studentsRef = ref(database, "Students");
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      const studentsWithAttendance = Object.keys(data).map((key) => ({
        value: key,
        label: data[key].studentName,
        attendance: data[key].attendance,
        studentNumber: data[key].studentNumber,
        group: data[key].group,
      }));

      setStudentsData(studentsWithAttendance);
    });
  }, []);

  useEffect(() => {
    const coursesRef = ref(database, "Courses");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      setCoursesData(Object.values(data || []));
    });
  }, []);

  useEffect(() => {
    const coursesRef = ref(database, "Rooms");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      setRoomsData(Object.values(data || []))
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
    const LessonTimeRef = ref(database, "LessonTimes");
    onValue(LessonTimeRef, (snapshot) => {
      const data = snapshot.val();

      setLessonTime(Object.values(data || {}));
    });
  }, [])


  const handleAttendance = (studentIndex, dateIndex, student, status) => {
    const newStudents = [...students, dateIndex];
    newStudents[studentIndex][`attendance`][months][dateIndex] = status;

    const studentCell = ref(database, `Students/${student.studentName}`);

    update(studentCell, {
      [`attendance/${months}/${dateIndex}`]: status,
    }).catch((error) => {
      console.error("Error adding group to Firebase:", error);
    });

    setStudents(students);
  };

  const handleDayChange = (day) => {
    // Remove the day if it's already selected
    if (selectedDays.includes(day)) {
      setSelectedDays(prev => prev.filter(d => d !== day));
      return;
    }

    // Add the new day first
    const updatedDays = [...selectedDays, day];

    // Check for odd days pattern (du, chor, ju)
    const oddDays = ['du', 'chor', 'ju'];
    const evenDays = ['se', 'pay', 'shan'];

    // Check if all odd days are selected
    const selectedOddDays = updatedDays.filter(d => oddDays.includes(d));
    if (selectedOddDays.length === 3 && oddDays.includes(day)) {
      setSelectedDays([...oddDays, 'toq kunlar']); // Keep odd days selected and add label
      return;
    }

    // Check if all even days are selected
    const selectedEvenDays = updatedDays.filter(d => evenDays.includes(d));
    if (selectedEvenDays.length === 3 && evenDays.includes(day)) {
      setSelectedDays([...evenDays, 'juft kunlar']); // Keep even days selected and add label
      return;
    }

    setSelectedDays(updatedDays);
  };

  const handleSelectDays = (value) => {
    value === "JUft kunlar (SPSH)" ? setAddGroup({ ...AddGroup, selectedDays: ["Se", "Pay", "Shan"] }) :
      value === "Toq kunlar (DCHJ)" ? setAddGroup({ ...AddGroup, selectedDays: ["Du", "Chor", "Ju"] }) :
        value === "Har kuni" ? setAddGroup({ ...AddGroup, selectedDays: ["Du", "Se", "Chor", "Pay", "Ju", "Shan", "Yak"] }) :
          value === "Maxsus kunlar" ? setAddGroup({ ...AddGroup, selectedDays: "Maxsus kunlar" }) : null
  }

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
    if ((AddGroup.groupName && AddGroup.courses && LessonStartTime && AddGroup.rooms && AddGroup.teachers) !== "" && AddGroup.selectedDays != []) {

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
          setOpen(false);
          setAddGroup({
            groupName: "",
            courses: "",
            rooms: "",
            teachers: "",
            selectedDays: []
          })
          setLessonStartTime(null)
          AddNotify({ AddTitle: "Guruh qo'shildi!" })
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

  return (
    <>
      <ToastContainer />
      <SidebarProvider>
        {open && (
          <div
            className="fixed w-full h-[100vh] z-30  inset-0 backdrop-blur-[2px] bg-black/50 transition-all duration-900 ease-in-out"
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
            <h2 className="text-xl font-semibold">Yangi guruh qo'shish</h2>
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
            <form
              className="space-y-6 p-6 text-left "
            >
              <div className="space-y-6">
                <Label htmlFor="courseName">Guruh nomi</Label>
                <Input
                  id="courseName"
                  value={AddGroup.groupName}
                  placeholder="Guruh nomini kiriting"
                  className={`w-full ${style.inputSearch}`}
                  onChange={(e) => setAddGroup({ ...AddGroup, groupName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseSelect">Kursni tanlash</Label>
                <SelectReact
                  value={
                    AddGroup.courses
                      ? { value: AddGroup.courses, label: AddGroup.courses }
                      : null
                  }
                  onChange={e => setAddGroup({ ...AddGroup, courses: e.value })}
                  options={coursesData.map(cours => ({ value: cours.name, label: cours.name }))}
                  placeholder="Kursni tanlang"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">O'qituvchi</Label>
                <SelectReact
                  value={
                    AddGroup.teachers
                      ? { value: AddGroup.teachers, label: AddGroup.teachers }
                      : null
                  }
                  onChange={e => setAddGroup({ ...AddGroup, teachers: e.value })}
                  options={teachersData.map(teacher => ({ value: teacher.name, label: teacher.name }))}
                  placeholder="O'qituvchini tanlang"
                />
              </div>

              <div className="space-y-3">
                <Label>Dars kunlari</Label>
                <div className="flex flex-wrap gap-3">
                  {AddGroup.selectedDays !== "Maxsus kunlar" ?
                    <SelectReact
                      className="w-full"
                      value={
                        AddGroup.selectedDays && Array.isArray(AddGroup.selectedDays) && AddGroup.selectedDays.length > 0
                          ? { value: AddGroup.selectedDays[0], label: AddGroup.selectedDays[0] }
                          : null
                      }
                      onChange={e => handleSelectDays(e.value)}
                      options={days.map(day => ({ value: day.label, label: day.label }))}
                      placeholder="Dars kunlarini tanlang"
                    /> :
                    <div className="w-full flex justify-start flex-col gap-3">
                      <div
                        className="cursor-pointer w-[30px] h-[30px] rounded-full hover:bg-gray-200 flex justify-center items-center"
                        onClick={() => setAddGroup({ ...AddGroup, selectedDays: [] })}
                      >
                        <PiArrowUDownLeftBold className="text-lg" />
                      </div>
                      {
                        daysOfWeek.map((day) => (
                          <div
                            key={day.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={day.id}
                              checked={selectedDays.includes(day.id)}
                              onCheckedChange={() => handleDayChange(day.id)}
                            />
                            <Label
                              htmlFor={day.id}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {day.label}
                            </Label>
                          </div>
                        ))}
                    </div>
                  }
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dars vaqti</Label>
                <SelectReact
                  placeholder="Dars vaqti tanlang"
                  className="w-full"
                  options={LessonTime.map((time) => ({ value: time, label: time }))}
                  onChange={(e) => setLessonStartTime(e.value)}
                  value={
                    LessonStartTime
                      ? { value: LessonStartTime, label: LessonStartTime }
                      : null
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Xona</Label>
                <SelectReact
                  value={
                    AddGroup.rooms
                      ? { value: AddGroup.rooms, label: AddGroup.rooms }
                      : null
                  }
                  onChange={e => setAddGroup({ ...AddGroup, rooms: e.value })}
                  options={roomsData.map(room => ({ value: room.name, label: room.name }))}
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

      <div>

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
            <Button className={style.groupAddButton}
              onClick={() => {
                setOpen(true);
                toggleSidebar();
              }}>
              Guruh qo'shish
            </Button>
          </div>

        </div>
        <Sheet>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Yangi kurs qo'shish</SheetTitle>
            </SheetHeader>
            <form className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Kurs nomi</Label>
                <Input id="title" placeholder="Kurs nomini kiriting" className={`${style.inputSearch}`} />
              </div>
              <div className="grid gap-2">
                <Label>O'qituvchi</Label>
                <Popover open={openTeacher} onOpenChange={setOpenTeacher}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openTeacher} className="justify-between">
                      {valueTeacher
                        ? teachers.find((teacher) => teacher.value === valueTeacher)?.label
                        : "O'qituvchini tanlang..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="O'qituvchi qidirish..." />
                      <CommandList>
                        <CommandEmpty>O'qituvchi topilmadi.</CommandEmpty>
                        <CommandGroup>
                          {teachers.map((teacher) => (
                            <CommandItem
                              key={teacher.value}
                              value={teacher.value}
                              onSelect={(currentValue) => {
                                setValueTeacher(currentValue === valueTeacher ? "" : currentValue)
                                setOpenTeacher(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", valueTeacher === teacher.value ? "opacity-100" : "opacity-0")}
                              />
                              {teacher.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Narxi</Label>
                <Input id="price" placeholder="Narxini kiriting" type="number" className={`${style.inputSearch}`} />
              </div>
              <div className="grid gap-2">
                <Label>Dars kunlari</Label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox id={day.id} />
                      <Label htmlFor={day.id}>{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Dars vaqti</Label>
                <div className="flex gap-2">
                  <Input type="time" className={`${style.inputSearch}`} placeholder="Boshlanish vaqti" />
                  <Input type="time" className={`${style.inputSearch}`} placeholder="Tugash vaqti" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Xona</Label>
                <Popover open={openRoom} onOpenChange={setOpenRoom}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openRoom} className="justify-between">
                      {valueRoom ? rooms.find((room) => room.value === valueRoom)?.label : "Xonani tanlang..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Xona qidirish..." />
                      <CommandList>
                        <CommandEmpty>Xona topilmadi.</CommandEmpty>
                        <CommandGroup>
                          {rooms.map((room) => (
                            <CommandItem
                              key={room.value}
                              value={room.value}
                              onSelect={(currentValue) => {
                                setValueRoom(currentValue === valueRoom ? "" : currentValue)
                                setOpenRoom(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", valueRoom === room.value ? "opacity-100" : "opacity-0")}
                              />
                              {room.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="mt-2">
                Saqlash
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default Groups;
