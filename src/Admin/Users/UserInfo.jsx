import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarPanel } from "../../Sidebar";

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
import style from "./Users.module.css";

import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "../../components/ui/sidebar";
import { Label } from "../../components/ui/UiLabel";
import { Input } from "../../components/ui/input";
import { GraduationCap, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { GoPencil } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Checkbox } from "../../components/ui/checkbox";


const UserInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [firstTeacher, setfirstTeacher] = useState([]);
  const [Course, setCourse] = useState([])
  const [TakeGroup, setTakeGroup] = useState([]);
  const [Takestudents, setTakeStudents] = useState([]);
  const [FilterGroup, setFilterGroup] = useState([]);
  const [FilterStudent, setFilterStudent] = useState([]);
  const [delateOpen1, setDelateOpen1] = useState(false);
  const [delateOpen2, setDelateOpen2] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [CheckValue, setCheckValue] = useState({
    value1: false,
    value2: false,
    value3: false,
  });

  const [tabs, setTabs] = useState("groups");

  const [chengeUser, setchengeUser] = useState({
    name: firstTeacher.name,
    number: firstTeacher.number,
    email: firstTeacher.email,
    job: firstTeacher.job,
    young: firstTeacher.young,
    address: firstTeacher.address,
  });

  useEffect(() => {
    const TeacherRef = ref(database, `Teachers/Teacher${id}`);

    onValue(TeacherRef, (snapshot) => {
      const data = snapshot.val();

      setfirstTeacher(data);
    });

  }, [id]);

  useEffect(() => {
    const GroupRef = ref(database, "Groups");

    onValue(GroupRef, (snapshot) => {
      const data = snapshot.val()

      setTakeGroup(Object.values(data || {}));
    })

    const StudentRef = ref(database, "Students");
    onValue(StudentRef, (snapshot) => {
      const data = snapshot.val()

      setTakeStudents(Object.values(data || {}));
    })

  }, [])

  useEffect(() => {
    const filterGroup = TakeGroup.filter((group) => group.teachers === firstTeacher.name);

    setFilterGroup(filterGroup);
  }, [TakeGroup, firstTeacher.name]);

  useEffect(() => {
    if (FilterGroup.length > 0 && Takestudents.length > 0) {
      const allFilteredStudents = Takestudents.filter(student =>
        FilterGroup.some(group => group.groupName === student.group)
      );

      setFilterStudent(allFilteredStudents);
    }
  }, [FilterGroup, Takestudents]);

  // get user's old data
  useEffect(() => {
    if (firstTeacher) {
      setchengeUser({
        name: firstTeacher.name || "",
        number: firstTeacher.number || "",
        email: firstTeacher.email || "",
        job: firstTeacher.job || "",
        young: firstTeacher.young || "",
        address: firstTeacher.address || "",
      });
    }
  }, [firstTeacher]);

  useEffect(() => {
    if (firstTeacher && firstTeacher.permissions) {
      setCheckValue({
        value1: firstTeacher.permissions.toAttend || false,
        value2: firstTeacher.permissions.toChangeInfo || false,
        value3: firstTeacher.permissions.toAddPeople || false,
      });
    }
  }, [firstTeacher]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setOpen(!open);
  }

  const handleOpenModal = (e) => {
    e.preventDefault();
    setDelateOpen1(true);
    setDelateOpen2(true);
  };

  const handleCloseModal = (e) => {
    e.preventDefault();
    setDelateOpen1(false);
    setDelateOpen2(false);
  };

  const formatPhoneNumber = (value) => {
    const onlyDigits = value.replace(/\D/g, "").slice(0, 12); // faqat raqamlar va 12 ta belgigacha

    let result = "+998";

    if (onlyDigits.length > 3) result += " " + onlyDigits.slice(3, 5);
    if (onlyDigits.length > 5) result += " " + onlyDigits.slice(5, 8);
    if (onlyDigits.length > 8) result += " " + onlyDigits.slice(8, 10);
    if (onlyDigits.length > 10) result += " " + onlyDigits.slice(10, 12);

    return result;
  };

  const getPrice = (course) => {
    let price = 0
    const findCourse = [course].map(item => {
      const courseRef = ref(database, `Courses/${item}/price`)
      onValue(courseRef, (snapshot) => {
        const data = snapshot.val()

        price = new Intl.NumberFormat("uz-UZ").format(data)
      })
    })

    return price;    
  }

  const handleChengeToUser = () => {
    if ((chengeUser.name && chengeUser.number && chengeUser.email && chengeUser.job && chengeUser.address && chengeUser.young) === "") {
      alert("Barcha maydonlarni to'ldiring");
      return;
    }

    set(ref(database, `Teachers/Teacher${id}`), {
      id: firstTeacher.id,
      name: chengeUser.name,
      number: chengeUser.number,
      email: chengeUser.email,
      job: chengeUser.job,
      young: chengeUser.young,
      address: chengeUser.address,

      permissions: {
        toAttend: CheckValue.value1,
        toChangeInfo: CheckValue.value2,
        toAddPeople: CheckValue.value3,

        // Additional permissions can be added here
      },
    })
      .then(() => {
        alert("O'zgartirishlar saqlandi");
      })
      .catch((error) => {
        console.error("Xatolik yuz berdi", error);
      });
  }

  const handleDeleteUser = () => {
    const leadRef = ref(database, `Teachers/Teacher${id}`);

    remove(leadRef)

    navigate("/users")
    handleCloseModal()
  }

  return (
    <>

      {
        delateOpen1 ?
          <Modal
            onClose={(e) => {
              e.preventDefault()
              setDelateOpen1(false)
            }}
            title="Xodimni o'chirish"
            positionTop={"top-[40px]"}
            isOpen={delateOpen2}
            children={
              <div className="flex justify-center gap-16">
                <Button onClick={handleDeleteUser} variant="red" className="rounded-3xl text-base px-8 py-5">Ha</Button>
                <Button onClick={handleCloseModal} variant="outline" className="rounded-3xl text-base px-8 py-5">Yo'q</Button>
              </div>
            }
          />
          : ""
      }

      <SidebarProvider>
        {isOpen && open && (
          <div
            className="fixed w-full h-[100vh] bg-black/50 backdrop-blur-[2px] z-30 inset-0 transition-all duration-900 ease-in-out"
            onClick={toggleSidebar}
          ></div>
        )}
        <Sidebar
          className={`fixed inset-y-0 right-0 z-50 w-[400px] border-l border-gray-300 bg-white transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
            }`}
          side="right"
          collapsible="none"
        >
          <SidebarHeader className="flex items-center justify-between border border-gray-300 p-4">
            <h2 className="text-lg font-normal">Xodimni tahrirlash</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </SidebarHeader>

          <SidebarContent>
            <form className="space-y-6 p-6 text-left">
              <div className="flex flex-col gap-3">
                <Label htmlFor="courseSelect" className="text-xs text-gray-500">Ism</Label>
                <Input
                  id="courseSelect"
                  type="text"
                  placeholder="Xodim ismi"
                  value={chengeUser.name}
                  onChange={(e) =>
                    setchengeUser((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="courseSelect" className="text-xs text-gray-500">Yoshi</Label>
                <Input
                  id="courseSelect"
                  type="number"
                  placeholder="Xodim yoshi"
                  value={chengeUser.young || ""}
                  onChange={(e) =>
                    setchengeUser((prevState) => ({
                      ...prevState,
                      young: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="coursePrice" className="text-xs text-gray-500">Telifon raqami</Label>
                <Input
                  id="coursePrice"
                  placeholder="+XXX XX XXX XX XX"
                  type="text"
                  value={chengeUser.number || ""}
                  onChange={(e) => {

                    setchengeUser((prevState) => ({
                      ...prevState,
                      number: formatPhoneNumber(e.target.value),
                    }));
                  }}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="courseMonth" className="text-xs text-gray-500">E-mail address</Label>
                <Input
                  id="courseMonth"
                  type="text"
                  placeholder="E-mail manzili"
                  value={chengeUser.email || ""}
                  onChange={(e) =>
                    setchengeUser((prevState) => ({
                      ...prevState,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="courseNotes" className="text-xs text-gray-500">Yo'nalishi</Label>
                <Input
                  id="courseNotes"
                  type="text"
                  placeholder="Yo'nalishi"
                  value={chengeUser.job || ""}
                  onChange={(e) =>
                    setchengeUser((prevState) => ({
                      ...prevState,
                      job: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="address" className="text-xs text-gray-500">Yashash manzili</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Yashash manzili"
                  value={chengeUser.address || ""}
                  onChange={(e) =>
                    setchengeUser((prevState) => ({
                      ...prevState,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <h4
                  className={`flex items-center gap-2 text-sm font-normal text-gray-400 ${CheckValue.value1 ? "text-gray-950" : "text-gray-400"
                    }`}
                >
                  <Checkbox
                    id="checkbox1"
                    className="data-[state=checked]:bg-blue-950"
                    checked={CheckValue.value1}
                    onClick={(e) => {
                      setCheckValue((prevState) => ({
                        ...prevState,
                        value1: e.target.ariaChecked === "true" ? false : true,
                      }));
                    }}
                  />
                  <Label
                    htmlFor="checkbox1"
                    className={`text-sm font-normal ${CheckValue.value1 ? "text-gray-950" : "text-gray-400"
                      } cursor-pointer`}
                  >
                    Davomat qilish
                  </Label>
                </h4>
                <h4
                  className={`flex items-center gap-2 text-sm font-normal text-gray-400 ${CheckValue.value2 ? "text-gray-950" : "text-gray-400"
                    }`}
                >
                  <Checkbox
                    id="checkbox2"
                    className="data-[state=checked]:bg-blue-950"
                    checked={CheckValue.value2}
                    onClick={(e) => {
                      setCheckValue((prevState) => ({
                        ...prevState,
                        value2: e.target.ariaChecked === "true" ? false : true,
                      }));
                    }}
                  />
                  <Label
                    htmlFor="checkbox2"
                    className={`text-sm font-normal ${CheckValue.value2 ? "text-gray-950" : "text-gray-400"
                      } cursor-pointer`}
                  >
                    Ma'lumotlarni o'zgartirish
                  </Label>
                </h4>
                <h4
                  className={`flex items-center gap-2 text-sm font-normal text-gray-400 ${CheckValue.value3 ? "text-gray-950" : "text-gray-400"
                    }`}
                >
                  <Checkbox
                    id="checkbox3"
                    className="data-[state=checked]:bg-blue-950"
                    checked={CheckValue.value3}
                    onClick={(e) => {
                      setCheckValue((prevState) => ({
                        ...prevState,
                        value3: e.target.ariaChecked === "true" ? false : true,
                      }));
                    }}
                  />
                  <Label
                    htmlFor="checkbox3"
                    className={`text-sm font-normal ${CheckValue.value3 ? "text-gray-950" : "text-gray-400"
                      } cursor-pointer`}
                  >
                    Odamlar qo'shish
                  </Label>
                </h4>
              </div>
              <Button
                className="bg-blue-950 hover:opacity-80 text-white"
                onClick={(event) => {
                  event.preventDefault();
                  setOpen(false);
                  handleChengeToUser();
                }}
              >
                Saqlash
              </Button>
            </form>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>


      <div className="UserInfo">

        <div
          className={style.info}
          style={{
            marginLeft: "var(--sidebar-width, 250px)",
            width: "var(--sidebar-width), 100%",
            transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
          }}
        >
          <h1 className={`${style.title} text-3xl font-simebolt`}>
            Xodim
          </h1>
          <div className={`${style.CardContainer} w-full flex justify-start gap-8`}>
            <Card className={`${style.card} flex flex-col gap-5 max-h-[490px]`}>
              <CardHeader className="w-full pb-5 border-b flex flex-row justify-between items-center border-gray-300">
                <h3 className="text-xl font-semibold">
                  {firstTeacher && firstTeacher.name
                    ? firstTeacher.name.toUpperCase()
                    : "Yuklanmoqda..."}
                </h3>
                <div className={`${style.icons}`}>
                  <div
                    className={`${style.icon}`}
                    onClick={toggleSidebar}
                  >
                    <GoPencil />
                  </div>
                  <div
                    className={`${style.icon}`}
                    onClick={handleOpenModal}
                  >
                    <MdDeleteOutline />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 items-start">
                <h6 className="text-lg">Tavsif</h6>

                <div className="flex flex-col gap-7">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm/3 text-gray-400">Yo'nalishi</span>
                    <h3 className="text-md/3 font-semibold">{firstTeacher.job ? firstTeacher.job : "Noma'lum"}</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm/3 text-gray-400">Yosh</span>
                    <h3 className="text-md/3 font-semibold">{firstTeacher.young ? firstTeacher.young + "yosh" : "Noma'lum"}</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm/3 text-gray-400">Manzil</span>
                    <h3 className="text-md/3 font-semibold">{firstTeacher.address ? firstTeacher.address : "Noma'lum"}</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm/3 text-gray-400">Telifon raqam</span>
                    <h3 className="text-md/3 font-semibold">{firstTeacher.number ? firstTeacher.number : "Noma'lum"}</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm/3 text-gray-400">E-mail address</span>
                    <h3 className="text-md/3 font-semibold">{firstTeacher.email ? firstTeacher.email : "Noma'lum"}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs
              defaultValue="groups"
              className="w-8/12"
              value={tabs}
              onValueChange={(value) => setTabs(value)}
            >
              <TabsList
                className="w-full bg-transparent flex justify-start items-center border-b pb-0 rounded-none border-gray-300 gap-5"
              >
                <TabsTrigger
                  onClick={() => setTabs("groups")}
                  className={`${tabs === "groups" ? "border-b border-black text-black" : ""} ${style.tabs}`}
                  value="groups"
                >
                  Guruhlar
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setTabs("students")}
                  className={`${tabs === "students" ? "border-b border-black text-black" : ""} ${style.tabs}`}
                  value="students"
                >
                  Talabalar
                </TabsTrigger>
              </TabsList>
              <TabsContent value="groups" className={`pt-6 ${FilterGroup.length > 0 ? "grid grid-cols-2 gap-5" : "flex justify-start"}`}>
                {
                  FilterGroup.length > 0 ? (
                    FilterGroup.map((group, index) => {
                      // Ushbu guruhga tegishli talabalarni hisoblash
                      const groupStudentsCount = FilterStudent.filter(student => student.group === group.groupName).length;
                      const coursePrice = getPrice(group.courses)

                      return (
                        <Card className="flex flex-col gap-5" key={index}>
                          <CardHeader className="flex justify-between w-full items-start flex-row">
                            <h1 className="text-lg">
                              {group.groupName}
                            </h1>
                            <p className="text-sm">{groupStudentsCount} ta odam</p>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 gap-5">
                            <div className="">
                              <span className="text-sm/3 text-gray-400">O'qituvchi</span>
                              <h4 className="text-base text-gray-950 flex gap-1">
                                <GraduationCap className="text-green-600" />
                                {group.teachers}
                              </h4>
                            </div>
                            <div className="">
                              <span className="text-sm/3 text-gray-400">Guruh narxi</span>
                              <h4 className="text-base text-gray-950">
                                {coursePrice} so'm
                              </h4>
                            </div>
                            <div className="">
                              <span className="text-sm/3 text-gray-400">Guruh vaqti</span>
                              <h4 className="text-base text-gray-950">
                                {group.duration} gacha
                              </h4>
                            </div>
                            <div className="">
                              <span className="text-sm/3 text-gray-400">Xona</span>
                              <h4 className="text-base text-gray-950">
                                {group.rooms}
                              </h4>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <h1
                      className="text-sm font-normal w-full py-3 px-5 bg-purple-300/70 text-gray-500"
                    >
                      Ushbu o'qituvchining guruhlari mavjud emas
                    </h1>
                  )
                }
              </TabsContent>
              <TabsContent value="students" className="pt-6">
                {
                  FilterStudent.length > 0 ? (
                    <div className="flex flex-col gap-5">
                      {FilterStudent.map((student, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <h1 className="text-lg font-semibold">{student.studentName}</h1>
                          <p className="text-sm text-gray-500">{student.group}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <h1
                      className="text-sm font-normal w-full py-3 px-5 bg-purple-300/70 text-gray-500"
                    >
                      Ushbu o'qituvchining talabalari mavjud emas
                    </h1>
                  )
                }
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserInfo