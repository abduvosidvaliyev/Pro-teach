"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { UserPlus, Users, Trash2, X, UserCheck } from "lucide-react"
import SelectReact from "react-select"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "../components/ui/sidebar";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  get
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { Modal } from "../components/ui/modal"
import { cn } from "../lib/utils"

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const statusColors = {
  Yangi: "bg-blue-500",
  Qiziqgan: "bg-yellow-500",
  Kutilmoqda: "bg-purple-500",
  Yopilgan: "bg-green-500",
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const courses = [
  "Web dasturlash",
  "Data Science",
  "Mobile dasturlash",
  "UI/UX dizayn",
  "Python",
  "Java",
  "JavaScript",
  "React",
]
const getCurrentMonth = () => {
  const now = new Date();
  return now.toLocaleString("en-US", { month: "long", year: "numeric" }); // Masalan: "April 2025"
};

const countWeekdaysInMonth = (selectedDays, startDate) => {
  const year = startDate.getFullYear();
  const month = startDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const dayMapping = {
    yak: 0, // Yakshanba
    du: 1,  // Dushanba
    se: 2,  // Seshanba
    chor: 3, // Chorshanba
    pay: 4, // Payshanba
    ju: 5,  // Juma
    sha: 6, // Shanba
  };

  let count = {};
  selectedDays.forEach((day) => {
    count[day] = 0; // Har bir kun uchun boshlang'ich qiymat
  });

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const weekday = date.getDay();

    for (const [key, value] of Object.entries(dayMapping)) {
      if (selectedDays.includes(key) && weekday === value) {
        count[key]++;
      }
    }
  }

  return count;
};

const countWeekdaysToEndOfMonth = (selectedDays, startDate) => {
  const year = startDate.getFullYear();
  const month = startDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const dayMapping = {
    yak: 0, // Yakshanba
    du: 1,  // Dushanba
    se: 2,  // Seshanba
    chor: 3, // Chorshanba
    pay: 4, // Payshanba
    ju: 5,  // Juma
    sha: 6, // Shanba
  };

  let count = {};
  selectedDays.forEach((day) => {
    count[day] = 0; // Har bir kun uchun boshlang'ich qiymat
  });

  for (let day = startDate.getDate(); day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const weekday = date.getDay();

    for (const [key, value] of Object.entries(dayMapping)) {
      if (selectedDays.includes(key) && weekday === value) {
        count[key]++;
      }
    }
  }

  return count;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [Students, setStudents] = useState([])
  const [GroupData, setGroupData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth())
  const [newUser, setnewUser] = useState({})
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [tabs, setTabs] = useState("add")

  // read leads from firebase
  useEffect(() => {
    const takeLeads = ref(database, "leads")

    onValue(takeLeads, (snapshot) => {
      const leads = snapshot.val()

      const formattedLeads = leads ? Object.values(leads) : [];
      setLeads(formattedLeads);
    })
  }, [])

  // read students from firebase
  useEffect(() => {
    const takeStudents = ref(database, "Students")

    onValue(takeStudents, (snapshot) => {
      const students = snapshot.val()
      const formattedStudents = students ? Object.values(students) : [];

      setStudents(formattedStudents)
    })
  }, [])

  // read groups from firebase
  useEffect(() => {
    const coursesRef = ref(database, "Groups");

    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();

      const groupArray = data ? Object.values(data) : [];

      setGroupData(groupArray);
    });
  }, []);

  // read teachers from firebase
  useEffect(() => {
    const coursesRef = ref(database, "Teachers");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      const teacherData = Object.keys(data).map((key) => ({
        value: key,
        label: data[key].name,
      }));
      setTeachersData(teacherData);
    });
  }, []);

  // read rooms from firebase
  useEffect(() => {
    const coursesRef = ref(database, "Rooms");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      const roomData = Object.keys(data).map((key) => ({
        value: key,
        label: data[key].name,
      }));
      setRoomsData(roomData);
    });
  }, []);

  // state to store new lead data 
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    status: "Yangi",
    source: "",
    course: "",
    time: "",
    notes: "",
  })

  const [filterStatus, setFilterStatus] = useState("all")

  const handleNotesChange = (e) => {
    const { value } = e.target
    setNewLead({ ...newLead, notes: value })
  }

  const handleNameChange = (e) => {
    const { value } = e.target
    setNewLead({ ...newLead, name: value })
  }

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Harflar va boshqa belgilarni olib tashlaymiz

    if (!value.startsWith("998 ")) {
      value = "998 " + value.replace(/^998+/, "");
    }

    value = value.slice(0, 13); // Maksimal uzunlik 12 ta raqam bo‘lishi kerak

    let formattedNumber = `+${value}`; // Har doim `+998` ko‘rinishda bo‘lsin

    setNewLead({ ...newLead, phone: formattedNumber });
  };

  const handleStatusChange = (value) => {
    setNewLead({ ...newLead, status: value })
  }

  const handleSourceChange = (value) => {
    setNewLead({ ...newLead, source: value })
  }

  const handleCourseChange = (value) => {
    setNewLead({ ...newLead, course: value })
  }

  const handleTimeChange = (value) => {
    setNewLead({ ...newLead, time: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if ((newLead.name && newLead.phone && newLead.status && newLead.source && newLead.course && newLead.time) === "") {
      alert("Iltimos barcha maydonlarni to'ldiring")
      return
    }

    const id = leads.length + 1
    const date = new Date().toISOString().split("T")[0]

    // push lead to firebase
    set(ref(database, `leads/${newLead.name}`), {
      id: id,
      name: newLead.name,
      phone: newLead.phone,
      status: newLead.status,
      source: newLead.source,
      course: newLead.course,
      notes: newLead.notes,
      time: newLead.time,
      date: date
    })

    setNewLead({ name: "", phone: "", status: "Yangi", time: "", notes: "" })
  }


  const filteredLeads = filterStatus === "all" ? leads : leads.filter((lead) => lead.status === filterStatus)

  // delate leads
  const handleDeleteLead = (name) => {

    const leadRef = ref(database, `leads/${name}`);

    remove(leadRef)
  }

  // add to group
  const handleAddToGroup = () => {
    if (!selectedOptions.groups?.label) {
      alert("Iltimos, guruhni tanlang!");
      return;
    }
    const date = new Date().toISOString().split("T")[0]; // Qo'shilgan sana
    const today = new Date(); // Bugungi sana
  
    // Guruh ma'lumotlarini olish
    const groupRef = ref(database, `Groups/${selectedOptions.groups.label}`);
    get(groupRef)
      .then((groupSnapshot) => {
        if (groupSnapshot.exists()) {
          const groupData = groupSnapshot.val();
          const courseFee = groupData.price || 0; // Guruh narxi
          const selectedDays = groupData.selectedDays || []; // Guruh dars kunlari
  
          // Oy oxirigacha bo'lgan dars kunlarini hisoblash
          const remainingLessonDays = countWeekdaysToEndOfMonth(selectedDays, today);
          const remainingLessonDaysCount = Object.values(remainingLessonDays).reduce(
            (sum, count) => sum + count,
            0
          );
  
          // Har bir dars uchun narxni hisoblash
          const totalLessonDays = countWeekdaysInMonth(selectedDays, today);
          const totalLessonDaysCount = Object.values(totalLessonDays).reduce(
            (sum, count) => sum + count,
            0
          );
          const perLessonCost = courseFee / totalLessonDaysCount;
  
          // Qolgan dars kunlari uchun umumiy to'lovni hisoblash
          const totalDeduction = Math.round(perLessonCost * remainingLessonDaysCount);
  
          // Studentni Firebase-ga qo'shish
          set(ref(database, `Students/${newUser.name}`), {
            attendance: {
              [currentMonth]: {
                _empty: true,
              },
            },
            id: Students.length,
            balance: -totalDeduction, // Faqat qolgan dars kunlari uchun to'lov
            group: selectedOptions.groups.label,
            studentName: newUser.name,
            studentNumber: newUser.phone,
            status: "Faol",
            addedDate: date, // Qo'shilgan sana
          });
  
          console.log(
            `Student ${newUser.name} added to group ${selectedOptions.groups.label} with balance updated: -${totalDeduction}`
          );
  
          // Leadni Firebase-dan o'chirish
          handleDeleteLead(newUser.name);
        } else {
          console.error("Group data not found in Firebase.");
        }
      })
      .catch((error) => {
        console.error("Error fetching group data:", error);
      });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSelectChange = (selectedOption, actionMeta) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [actionMeta.name]: selectedOption, // To'liq obyektni saqlaymiz
    }));
  };

  const toggleSidebar = (id) => {
    setIsOpen(!isOpen);
    const newUser = leads.find(user => user.id === id)

    setnewUser(newUser)
  };

  const [openModal, setopenModal] = useState(false)
  const [firstInformation, setfirstInformation] = useState({})

  const OpenModal = (id) => {
    const FindStudents = leads.find(firstStudent => firstStudent.id === id)
    setfirstInformation(FindStudents)
    setopenModal(true)
  }

  const CloseModal = () => setopenModal(false)

  const sourceVebSayt = leads.filter((leads) => leads.source === "Veb-sayt")
  const sourceInstagram = leads.filter((leads) => leads.source === "Instagram")
  const sourceFacebook = leads.filter((leads) => leads.source === "Facebook")
  const sourceGoogle = leads.filter((leads) => leads.source === "Google")
  const sourceTavsiya = leads.filter((leads) => leads.source === "Tavsiya")

  // source data for pie chart
  const sourceData = [
    { name: "Veb-sayt", value: sourceVebSayt.length },
    { name: "Instagram", value: sourceInstagram.length },
    { name: "Facebook", value: sourceFacebook.length },
    { name: "Google", value: sourceGoogle.length },
    { name: "Tavsiya", value: sourceTavsiya.length },
  ]

  return (
    <>
      {openModal ? <Modal
        isOpen={openModal}
        onClose={CloseModal}
        positionTop={"top-[20%]"}
        title={`${firstInformation.name}ning ma'lmotlari`}
        children={
          <div className="flex flex-col space-y-2">
            <h3 className="text-md font-semibold">
              ID: {firstInformation.id}
            </h3>
            <h4 className="text-md font-semibold">
              Ismi: {firstInformation.name}
            </h4>
            <h4 className="text-md font-semibold">
              Telefon raqami: {firstInformation.phone}
            </h4>
            <h4 className="text-md font-semibold">
              Qaysi soha: {firstInformation.course}
            </h4>
            <h4 className="text-md font-semibold">
              Bizni qanday topdi: {firstInformation.source}
            </h4>
            <h4 className="text-md font-semibold">
              Statusi: {firstInformation.status}
            </h4>
            <h4 className="text-md font-semibold">
              Qachon royhatga olingan: {firstInformation.date}
            </h4>
            <h4 className="text-md font-semibold">
              Qaysi payt: {firstInformation.time}
            </h4>
            <h4 className="text-md font-semibold">
              Bu yerga kelishiga nima sabab: {firstInformation.notes}
            </h4>
          </div>
        }
      /> : ""}
      <SidebarProvider>
        {isOpen && (
          <div
            className="fixed w-full  h-[100vh] z-30  inset-0 backdrop-blur-sm transition-all duration-900 ease-in-out"
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
            <h2 className="text-xl font-semibold">Guruhga qo'shish</h2>
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
              onSubmit={handleSubmit}
              className="space-y-6 p-6 text-left "
            >
              <div className="space-y-2">
                <Label htmlFor="courseSelect">Guruh tanlash</Label>
                <SelectReact
                  value={selectedOptions.groups} // Bu obyekt bo'lishi kerak: { label, value }
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, { name: "groups" })
                  }
                  options={GroupData.map((group) => ({
                    label: group.groupName,
                    value: group.id, // value qo'shildi
                  }))}
                />
              </div>

              <Button
                className="w-full bg-black hover:opacity-80 text-white"
                onClick={(event) => {
                  event.preventDefault(); // Prevent form submission
                  setOpen(false);
                  toggleSidebar();
                  handleAddToGroup();
                }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Qo'shish
              </Button>
            </form>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>

      <div className={`container mx-auto p-4 space-y-8`}>

        <h1 className="text-3xl font-bold mb-4">Lidlar boshqaruvi</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Jami Lidlar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Yangi Lidlar</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.filter((lead) => lead.status === "Yangi").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lidlar manbasi</CardTitle>
            </CardHeader>
            <CardContent>
              {sourceData.every((data) => data.value === 0) ? ( // Agar barcha value 0 bo'lsa
                <div className="text-center text-gray-500">Ma'lumot yo'q</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="add"
          value={tabs}
          onValueChange={(value) => setTabs(value)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              className={`${
                tabs === "list"
                  ? "bg-black text-white rounded-md h-full flex items-center justify-center"
                  : "h-full flex items-center justify-center"
              }`}
              value="list"
            >
              Lidlar ro'yxati
            </TabsTrigger>
            <TabsTrigger
              className={`${
                tabs === "add"
                  ? "bg-black text-white rounded-md h-full flex items-center justify-center"
                  : "h-full flex items-center justify-center"
              }`}
              value="add"
            >
              Yangi lid qo'shish
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Lidlar ro'yxati</CardTitle>
                <CardDescription>Barcha lidlar va ularning ma'lumotlari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Select onValueChange={setFilterStatus} defaultValue={filterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status bo'yicha filtrlash" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barchasi</SelectItem>
                      <SelectItem value="Yangi">Yangi</SelectItem>
                      <SelectItem value="Qiziqgan">Qiziqgan</SelectItem>
                      <SelectItem value="Kutilmoqda">Kutilmoqda</SelectItem>
                      <SelectItem value="Qayta aloqa">Qayta aloqa</SelectItem>
                      <SelectItem value="Yopilgan">Yopilgan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ism</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Manba</TableHead>
                      <TableHead>Kurs</TableHead>
                      <TableHead>Vaqt</TableHead>
                      <TableHead>Sana</TableHead>
                      <TableHead>Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead, index) => (
                      <TableRow key={lead.id} onClick={() => OpenModal(lead.id)}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>
                          <Badge variant="default" className={statusColors[lead.status]}>{lead.status}</Badge>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>{lead.course}</TableCell>
                        <TableCell>{lead.time}</TableCell>
                        <TableCell>{lead.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(event) => {
                                event.stopPropagation();
                                setopenModal(false);
                                setOpen(true);
                                toggleSidebar(lead.id);
                              }}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Guruhga qo'shish
                            </Button>
                            <Button
                              size="sm"
                              variant="red"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteLead(lead.name);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              O'chirish
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Yangi lid qo'shish</CardTitle>
                <CardDescription>Yangi lid ma'lumotlarini kiriting</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ism</Label>
                      <Input id="name" name="name" value={newLead.name} onChange={handleNameChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" name="phone" value={newLead.phone} placeholder="+998" onChange={handlePhoneChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select onValueChange={handleStatusChange} defaultValue={newLead.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yangi">Yangi</SelectItem>
                          <SelectItem value="Qiziqgan">Qiziqgan</SelectItem>
                          <SelectItem value="Kutilmoqda">Kutilmoqda</SelectItem>
                          <SelectItem value="Qayta aloqa">Qayta aloqa</SelectItem>
                          <SelectItem value="Yopilgan">Yopilgan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Manba</Label>
                      <Select onValueChange={handleSourceChange} defaultValue={newLead.source}>
                        <SelectTrigger>
                          <SelectValue placeholder="Manba tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Veb-sayt">Veb-sayt</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Google">Google</SelectItem>
                          <SelectItem value="Tavsiya">Tavsiya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Kurs</Label>
                      <Select onValueChange={handleCourseChange} defaultValue={newLead.course}>
                        <SelectTrigger>
                          <SelectValue placeholder="Kurs tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Vaqt</Label>
                      <Select  onValueChange={handleTimeChange} defaultValue={newLead.time}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vaqt tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Abetdan oldin (DCHJ)">Abetdan oldin (DCHJ)</SelectItem>
                          <SelectItem value="Abetdan oldin (SPSH)">Abetdan oldin (SPSH)</SelectItem>
                          <hr />
                          <SelectItem value="Abetdan keyin (DCHJ)">Abetdan keyin (DCHJ)</SelectItem>
                          <SelectItem value="Abetdan keyin (SPSH)">Abetdan keyin (SPSH)</SelectItem>
                          <hr />
                          <SelectItem value="Har qanday">Har qanday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="notes">Qo'shimcha ma'lumot</Label>
                      <Input id="notes" name="notes" value={newLead.notes} placeholder="Ma'lumot (ixtiyoriy)" onChange={handleNotesChange} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Yangi lid qo'shish
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div >
    </>
  )
}

