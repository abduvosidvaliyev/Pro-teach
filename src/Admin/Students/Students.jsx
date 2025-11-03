"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Students.module.css";

import { Button } from "@/components/ui/button";
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
  FileSpreadsheet,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "../../components/ui/sidebar";
import { Label } from "../../components/ui/UiLabel";
import SelectReact from "react-select"
import { ToastContainer } from "react-toastify";
import { AddNotify } from "../../components/ui/Toast"
import ReactPaginate from "react-paginate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { onValueData, readData, setData, updateData } from "../../FirebaseData"

const pages = [
  { value: 5, label: 5 },
  { value: 10, label: 10 },
  { value: 20, label: 20 },
  { value: 50, label: 50 },
]

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

  // useEffect(() => {
  //   const studentsRef = ref(database, "Students")

  //   get(studentsRef).then((snapshot) => {
  //     const data = snapshot.val()
  //     const students = Object.values(data || []).map((student) => {
  //       const studentref = ref(database, `Students/${student.studentName}/ball`)

  //       set(studentref, 0)
  //     })
  //   })
  // }, [])

  const [isAdd, setIsAdd] = useState(true);
  const [studentsData, setStudentsData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [groupsData, setGroupsData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [GetLeads, setGetLeads] = useState([])
  const [courses, setCourses] = useState([]);
  const [AddStudent, setAddStudent] = useState({
    name: "",
    group: "",
    login: "",
    parol: ""
  })
  const [firstLeads, setfirstLeads] = useState({})
  const [GetFilterStudent, setGetFilterStudent] = useState([])
  const [PER_PAGE, setPER_PAGE] = useState(10)
  const [page, setpage] = useState(null)

  const [CourseValue, setCourseValue] = useState("all")
  const [StatusValue, setStatusValue] = useState("Faol")
  const [PaymentValue, setPaymentValue] = useState("To'langan")
  const [TeacherValue, setTeacherValue] = useState("all")

  const toggleIsAdd = () => {
    setIsAdd(!isAdd);
  };


  useEffect(() => {
    onValueData("Students", (data) => {
      setStudentsData(Object.values(data || []));
    });

    onValueData(`Groups`, (data) => {
      setGroupsData(Object.values(data || {}))
    });

    onValueData(`Teachers`, (data) => {
      setTeachersData(data);
    });

    onValueData(`Courses`, (data) => {
      setCourses(Object.values(data || []));
    });

    onValueData("leads", (data) => {
      setGetLeads(Object.values(data || {}))
    })
  }, []);

  useEffect(() => {
    setGetFilterStudent(studentsData.sort((a, b) => a.id - b.id));
  }, [studentsData]);

  useEffect(() => {
    const searchStudent = GetLeads.find((value) => value.name.toLowerCase() === AddStudent.name.toLowerCase())
    setfirstLeads(searchStudent)
  }, [AddStudent.name])

  const handleStatusChenge = (name) => {
    updateData(`leads/${name}`, { status: "O'qiyabdi" })
  }

  const addStudent = () => {
    if ((AddStudent.name && AddStudent.group && AddStudent.login && AddStudent.parol) === "") {
      return
    }

    const date = new Date().toISOString().split("T")[0]; // Qo'shilgan sana

    // Guruh ma'lumotlarini olish
    readData(`Groups/${AddStudent.group}`)
      .then((data) => {
        if (data) {

          // Studentni Firebase-ga qo'shish
          setData(`Students/${AddStudent.name}`, {
            attendance: {
              [currentMonth]: {
                _empty: true,
              },
            },
            id: studentsData.length + 1,
            balance: 0,
            group: AddStudent.group,
            studentName: AddStudent.name,
            studentNumber: firstLeads.phone,
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
                description: `${AddStudent.name} ${AddStudent.group} guruhiga qo'shildi.`,
              },
            ],
            paymentHistory: []
          })
            .then(() => {
              toggleIsAdd()
              handleStatusChenge(firstLeads.name)
              setAddStudent({
                name: "",
                group: "",
                login: "",
                parol: ""
              })
              AddNotify({ AddTitle: "O'quvchi qo'shildi!" })
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

  const handleLinkClick = (event, student, studentId, studentName) => {
    event.stopPropagation();
    navigate(`/student/${studentId}`, { state: { student: student } });
  };

  const filterStudents = (value) => {
    if (value === "") {
      setCurrentPage(page)
    }
    const filterStudent = studentsData.filter((student) => student.studentName.toLowerCase().includes(value.toLowerCase()) ||
      value === "Faol" ? student.status === "Faol" : value === "Nofaol" ? student.status === "Nofaol" : value === "Muzlatilgan" ? student.status === "Muzlatilgan" : "")
    setGetFilterStudent(value === "" ? studentsData : filterStudent)
  }

  useEffect(() => {
    const filterStudent = studentsData.filter((student) => PaymentValue === "To'langan" ? Number(student.balance) >= 0 : Number(student.balance) < 0)
    setGetFilterStudent(PaymentValue === "all" ? studentsData : filterStudent)
  }, [PaymentValue])

  useEffect(() => {
    const filteredStudents = studentsData.filter(student => {
      const group = groupsData.find(item => item.groupName.toLowerCase() === student.group.toLowerCase());

      if (!group) return false;

      // Agar group.courses massiv bo‘lsa
      const finishFilter = Array.isArray(group.courses)
        ? group.courses.includes(CourseValue)
        : group.courses === CourseValue

      return finishFilter;
    });

    setGetFilterStudent(CourseValue === "all" ? studentsData : filteredStudents)
  }, [CourseValue])


  useEffect(() => {
    const filteredStudents = studentsData.filter(student => {
      const group = groupsData.find(item => item.groupName.toLowerCase() === student.group.toLowerCase());

      if (!group) return false;

      // Agar group.courses massiv bo‘lsa
      const finishFilter = Array.isArray(group.teachers)
        ? group.teachers.includes(TeacherValue)
        : group.teachers === TeacherValue

      return finishFilter;
    });

    setGetFilterStudent(TeacherValue === "all" ? studentsData : filteredStudents)
  }, [TeacherValue])

  useEffect(() => {
    const filterStudent = studentsData.filter((student) => StatusValue === "Faol" ? student.status === "Faol" : StatusValue === "Nofaol" ? student.status === "Nofaol" : StatusValue === "Muzlatilgan" ? student.status === "Muzlatilgan" : "")
    setGetFilterStudent(StatusValue == "all" ? studentsData : filterStudent)
  }, [StatusValue])

  const [currentPage, setCurrentPage] = useState(0);

  // Barcha student yozuvlarini flat qilish
  const allPayments = useMemo(() => {
    return GetFilterStudent;
  }, [GetFilterStudent, PER_PAGE]);

  const pageCount = Math.ceil(allPayments.length / PER_PAGE);

  // Hozirgi sahifadagi yozuvlar
  const currentPayments = useMemo(() => {
    const start = currentPage * PER_PAGE;
    return allPayments.slice(start, start + PER_PAGE);
  }, [allPayments, currentPage, PER_PAGE]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const [uniquePayment, setUniquePayment] = useState([])

  useEffect(() => {
    if (currentPayments.length === 0 && currentPage > 0) {
      setCurrentPage(0);
    }
  }, [currentPayments, currentPage]);

  useEffect(() => {
    const uniquePayment = [...new Map(currentPayments.map(item => [item.id, item])).values()];

    setUniquePayment(uniquePayment)
  }, [GetFilterStudent, PER_PAGE, currentPayments])

  useEffect(() => {
    setGetFilterStudent(studentsData.sort((a, b) => a.id - b.id));
  }, [studentsData]);

  return (
    <>
      <ToastContainer />

      <SidebarProvider>
        {(!isAdd) && (
          <div
            className="fixed w-full h-[100vh] bg-black/50 backdrop-blur-[2px] z-30 inset-0 transition-all duration-900 ease-in-out"
            onClick={toggleIsAdd}
          ></div>
        )}
        <Sidebar
          className={`fixed inset-y-0 right-0 z-50 w-[400px] border-l border-gray-300 bg-white transition-transform duration-300 ease-in-out ${!isAdd ? "translate-x-0" : "translate-x-full"}`}
          side="right"
          collapsible="none"
        >
          <SidebarHeader className="flex items-center justify-between border border-gray-300 p-4">
            <h2 className="text-lg font-normal">
              Yangi talaba qo'shish
            </h2>
            <Button
              onClick={toggleIsAdd}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <form className="space-y-6 p-6 text-left">
              <div className="flex flex-col gap-3">
                <Label htmlFor="courseSelect" className="text-xs text-gray-500">Talaba ismi</Label>
                <SelectReact
                  id="courseSelect"
                  value={
                    AddStudent.name
                      ? { value: AddStudent.name, label: AddStudent.name }
                      : null
                  }
                  className={`${style.inputSearch}`}
                  placeholder="Studentni qidirish..."
                  options={GetLeads.filter(item => item.status !== "O'qiyabdi").map((item) => ({ value: item.name, label: item.name }))}
                  onChange={(e) => (
                    setAddStudent({ ...AddStudent, name: e.value })
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="login" className="text-xs text-gray-500">Login</Label>
                <Input
                  id="login"
                  type="text"
                  value={AddStudent.login}
                  className={style.inputSearch}
                  placeholder="O'quvchi uchun login"
                  onChange={(e) => setAddStudent({ ...AddStudent, login: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="parol" className="text-xs text-gray-500">Parol</Label>
                <Input
                  id="parol"
                  type="text"
                  value={AddStudent.parol}
                  className={style.inputSearch}
                  placeholder="O'quvchi uchun parol"
                  onChange={(e) => setAddStudent({ ...AddStudent, parol: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="coursePrice" className="text-xs text-gray-500">Guruh nomi</Label>
                <SelectReact
                  id="coursePrice"
                  value={
                    AddStudent.group
                      ? { value: AddStudent.group, label: AddStudent.group }
                      : null
                  }
                  placeholder="Guruhni qidirish..."
                  options={groupsData.map((item) => ({ value: item.groupName, label: item.groupName }))}
                  className={`${style.inputSearch}`}
                  onChange={(e) => (setAddStudent({ ...AddStudent, group: e.value }), console.log(e.value))}
                />
              </div>
              <Button
                className="bg-blue-950 hover:opacity-80 text-white px-4 py-2 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  addStudent();
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
          className={`${style.main} ${PER_PAGE === 5 ? style.Main : ""}`}
          style={{
            marginLeft: "var(--sidebar-width, 250px)",
            width: "var(--sidebar-width), 100%",
            transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
          }}
        >
          <div className={style.studentAbout}>
            <h2>Talabalar soni: {studentsData.length}</h2>
            <Button
              onClick={toggleIsAdd}
              className="gap-2 bg-black text-white hover:opacity-80 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              YANGI QO'SHISH
            </Button>
          </div>
          <div className={style.students}>
            <div className="p-6 col-[1/11] flex flex-col">
              <div className="flex flex-wrap gap-4 mb-6 items-center">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Qidirish"
                    onChange={e => filterStudents(e.target.value)}
                    className={`pl-8 w-[200px] ${style.inputSearch}`}
                    onClick={() => setpage(currentPage)}
                  />
                </div>

                <Select defaultValue="all" onValueChange={setCourseValue}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Kurs bo'yicha" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">
                      Barchasi
                    </SelectItem>
                    {courses.map((course) => (
                      <SelectItem value={course.name}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select defaultValue="Faol" onValueChange={setStatusValue}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Status bo'yicha" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">
                      Barchasi
                    </SelectItem>
                    <SelectItem value="Faol">
                      Faol
                    </SelectItem>
                    <SelectItem value="Nofaol">
                      Nofaol
                    </SelectItem>
                    <SelectItem value="Muzlatilgan">
                      Muzlatilgan
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="To'langan" onValueChange={setPaymentValue}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Status bo'yicha" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">
                      Barchasi
                    </SelectItem>
                    <SelectItem value="To'langan">
                      To'langan
                    </SelectItem>
                    <SelectItem value="To'lanmagan">
                      To'lanmagan
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all" onValueChange={setTeacherValue}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="O'qituvchi bo'yicha" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">
                      Barchasi
                    </SelectItem>
                    {teachersData && Object.keys(teachersData).length > 0 ? (
                      Object.values(teachersData).map((teacher, index) => (
                        <SelectItem value={teacher.name}>
                          {teacher.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>
                        No teachers available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

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
              <div className={`${PER_PAGE >= 10 ? "h-[500px] overflow-auto w-full" : ""}`}>
                <Table className=" h-[100px] overflow-auto">
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
                    {studentsData.length > 0 ? (
                      uniquePayment.map((student) => {
                        return (
                          <TableRow
                            onClick={(event) =>
                              handleLinkClick(event, student, student.id, student.studentName)
                            }
                            key={student.id}
                          >
                            <TableCell>{student.id}</TableCell>
                            <TableCell>{student.studentName}</TableCell>
                            <TableCell>{student.ball} bal</TableCell>
                            <TableCell>{student.studentNumber}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {student.group}
                              </span>
                            </TableCell>
                            <TableCell>
                              {
                                (() => {
                                  const group = groupsData.find(item => item.groupName && student.group && item.groupName.toLowerCase() === student.group.toLowerCase());
                                  return group && group.teachers ? group.teachers : "";
                                })()
                              }
                            </TableCell>
                          </TableRow>
                        )
                      })) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">Ma'lumot yo'q</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginations */}
              <div className="flex items-center gap-3 self-end pt-10">
                <Select
                  value={String(PER_PAGE)}
                  onValueChange={val => {
                    setPER_PAGE(Number(val));
                    setCurrentPage(0);
                  }}
                  defaultValue={String(pages[1].value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Qator sonini tanlash" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.value} value={String(page.value)}>
                        {page.value} tadan
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ReactPaginate
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  previousLabel={<FiChevronLeft />}
                  nextLabel={<FiChevronRight />}
                  breakLabel="..."
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={1}
                  containerClassName="pagination"
                  activeClassName="active"
                />
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default Students;
