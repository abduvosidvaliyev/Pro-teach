import { supabase } from '../../supabaseClient';
import { uploadImage } from '../../uploadImage';
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import style from "./StudentDetail.module.css";
import SelectReact from "react-select";

import { MessageSquare, PenSquare, Plus, Calendar, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

import { Tabs } from "./Tabs";
import CourseGrid from "./CourseGrid";
import { Comments } from "./Comments";
import { StudentHistory } from "./StudentHistory";
import { Textarea } from "../../components/ui/textarea";
import { Modal } from "../../components/ui/modal";

import { FaArrowLeft, FaCamera, FaRegTrashAlt } from "react-icons/fa"
import { DelateNotify, ChengeNotify, AddNotify } from "../../components/ui/Toast"
import { ToastContainer } from "react-toastify";
import { FiDownload, FiMinusCircle } from "react-icons/fi";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "../../components/ui/sidebar";
import { Label } from "../../components/ui/UiLabel";
import { deleteData, onValueData, readData, updateData } from '../../FirebaseData';

const getCurrentMonth = () => {
  const now = new Date();
  return now.toLocaleString("en-US", { month: "long", year: "numeric" }); // Masalan: "April 2025"
};

const StudentDetail = () => {
  const location = useLocation();
  const courseData = location.state?.student;

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState([])
  const [studentsData, setStudentsData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [activeTab, setActiveTab] = useState("groups");
  const [date, setDate] = useState("30.01.2025");
  const [isOpen, setIsOpen] = useState(false);
  const [groupsData, setGroupsData] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [OpenDelateModal, setOpenDelateModal] = useState(false)
  const [OpenImg, setOpenImg] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Added state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // To'lov modalining holati
  const [paymentAmount, setPaymentAmount] = useState(""); // To'lov miqdori
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false); // Pul qaytarish modalining holati
  const [refundAmount, setRefundAmount] = useState(""); // Qaytariladigan pul miqdori
  const [chengeStudentInfo, setchengeStudentInfo] = useState({
    name: "",
    birthday: "",
    number: "",
    login: "",
    parol: ""
  })

  useEffect(() => {
    onValueData(`Students`, (data) => {
      setStudentsData(Object.values(data || {}));
    });

    onValueData("Groups", (data) => {
      setGroupsData(data ? Object.keys(data) : []);
    });
  }, []);

  useEffect(() => {
    const student = studentsData.find((s) => s.id === Number.parseInt(id));

    setStudent(student)
  }, [studentsData])



  // O'quvchiga tolov qilish
  const handlePayment = () => {
    if (!paymentAmount) {
      alert("To'lov miqdorini to'g'ri kiriting!");
      return;
    }

    const cleanAmount = parseFloat(paymentAmount.toString().replace(/\s/g, ""));
    const formattedPaymentAmount = new Intl.NumberFormat("uz-UZ", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(cleanAmount);

    const paymentDate = getCurrentDate();
    const paymentTime = new Date().toLocaleTimeString("en-US", { hour12: false });

    const paymentData = {
      date: paymentDate,
      amount: `+ ${formattedPaymentAmount}`,
      description: "To'lov qabul qilindi",
      status: "To'langan",
      time: paymentTime,
    };

    // ✅ Eski tarixni studentdan olamiz, readData emas
    const existingPayments = student.paymentHistory || [];
    const updatedPayments = [...existingPayments, paymentData];

    const newBalance = (parseFloat(student.balance) || 0) + cleanAmount; // ✅ Eski snapshot emas, state-dan

    updateData(`Students/${student.studentName}`, {
      paymentHistory: updatedPayments,
      balance: newBalance,
    })
      .then(() => {
        AddNotify({ AddTitle: "To'landi!" });
        setIsPaymentModalOpen(false);
        setPaymentAmount("");

        // ✅ Umumiy balansni yangilash
        readData("AllBalance").then((data) => {
          const oldBalance = parseFloat(data) || 0;
          setDate("AllBalance", oldBalance + cleanAmount);
        });
      })
      .catch((error) => console.error("Xatolik to'lovda:", error));
  };



  // Oquvchiga pul qaytarish
  const handleRefund = () => {
    if (!refundAmount) {
      alert("Qaytariladigan miqdorni to'g'ri kiriting!");
      return;
    }

    const cleanAmount = parseFloat(refundAmount.toString().replace(/\s/g, ""));
    const formattedRefundAmount = new Intl.NumberFormat("uz-UZ", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(cleanAmount);

    const refundDate = getCurrentDate();
    const refundTime = new Date().toLocaleTimeString("en-US", { hour12: false });
    const refundData = {
      date: refundDate,
      amount: `- ${formattedRefundAmount}`,
      description: "Pul qaytarildi",
      status: "Qaytarildi",
      time: refundTime,
    };

    // ✅ Eski tarixni studentdan olamiz
    const existingPayments = student.paymentHistory || [];
    const updatedPayments = [...existingPayments, refundData];

    const newBalance = (parseFloat(student.balance) || 0) - cleanAmount;

    updateData(`Students/${student.studentName}`, {
      paymentHistory: updatedPayments,
      balance: newBalance,
    })
      .then(() => {
        DelateNotify({ DelateTitle: "Yechildi!", Icon: FiMinusCircle });
        setIsRefundModalOpen(false);
        setRefundAmount("");

        // ✅ Umumiy balansni yangilash
        readData("AllBalance").then((data) => {
          const oldBalance = parseFloat(data) || 0;
          setDate("AllBalance", oldBalance - cleanAmount);
        });
      })
      .catch((error) => console.error("Xatolik refundda:", error));
  };

  // studentni boshqa guruhga qoshish
  const addStudentToGroup = () => {
    // Guruhdagi kunlarni olish
    onValueData(`Groups/${groupName}`, (data) => {
      if (!data) {
        alert("Guruh ma'lumotlari topilmadi!");
        return;
      }

      // Talabaning mavjud ma'lumotlarini olish
      readData(`Students/${student.studentName}`).then((studentData) => {
        // Talaba uchun yangi ma'lumotlar
        const newStudentData = {
          ...studentData,
          attendance: {
            [currentMonth]: { _empty: true }, // Maxsus kalit bilan bo'sh obyektni saqlash
          },
          group: groupName,
        };

        // `studentHistory`ga yangi yozuv qo'shish
        const newHistoryEntry = {
          date: getCurrentDate(), // Hozirgi sana
          title: "Guruhga qo'shildi",
          description: `${student.studentName} ${groupName} guruhiga qo'shildi.`,
        };

        const updatedHistory = studentData.studentHistory
          ? [...studentData.studentHistory, newHistoryEntry]
          : [newHistoryEntry];

        // Firebase ma'lumotlar bazasiga yozish
        updateData(`Students/${student.studentName}`, { ...newStudentData, studentHistory: updatedHistory })
          .then(() => {
            ChengeNotify()
          })
          .catch((error) => {
            console.error("Xatolik yuz berdi: ", error);
          });

        setIsOpen(false);
      });
    });
  };

  const CloseDelateModal = () => setOpenDelateModal(false)

  // studentni ochirish
  const handleDelateStudent = () => {
    const student = studentsData.find((student) => student.id === Number(id))

    deleteData(`Students/${student.studentName}`)
      .then(() => {
        readData("Students").then(data => {
          const studentsArr = Object.values(data);
          studentsArr.forEach((student, i) => {
            updateData(`Students/${student.studentName}`, { id: i + 1 });
          });
          setOpenDelateModal(false);
          DelateNotify({ DelateTitle: "O'quvchi o'chirildi!" });
          navigate("/students");
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // tel raqamni formatlash
  const formatPhoneNumber = (value) => {
    const onlyDigits = value.replace(/\D/g, "").slice(0, 12); // faqat raqamlar va 12 ta belgigacha

    let result = "+998";

    if (onlyDigits.length > 3) result += " " + onlyDigits.slice(3, 5);
    if (onlyDigits.length > 5) result += " " + onlyDigits.slice(5, 8);
    if (onlyDigits.length > 8) result += " " + onlyDigits.slice(8, 10);
    if (onlyDigits.length > 10) result += " " + onlyDigits.slice(10, 12);

    return result;
  };

  const handleUptadeStudent = async () => {
    const oldKey = student.studentName;
    const newKey = chengeStudentInfo.name;

    // Obyekt yangilanishi kerak bo‘lgan qiymatlar
    const updatedData = {
      studentName: newKey,
      birthday: chengeStudentInfo.birthday,
      studentNumber: chengeStudentInfo.number,
      login: chengeStudentInfo.login,
      parol: chengeStudentInfo.parol,
    };

    try {
      if (oldKey === newKey) {
        // Faqat qiymatlarni yangilash
        await updateData(`Students/${oldKey}`, updatedData);
      } else {
        // Eski key ostidagi ma'lumotlarni olib, yangi keyga yozish
        const snapshot = await readData(`Students/${oldKey}`);

        if (!snapshot) throw new Error("Eski o'quvchi topilmadi");

        const oldData = snapshot;

        await setDate(`Students/${newKey}`, { ...oldData, ...updatedData });
        await deleteData(`Students/${oldKey}`);
      }

      ChengeNotify({ ChengeTitle: "Ma'lumot o'zgartirildi" });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("O'quvchi ma'lumotlarini yangilashda xatolik:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Supabase'ga rasmni yuklaymiz
      const imageUrl = await uploadImage(file);

      // Firebase Realtime Database'dagi studentga rasm linkini yozamiz
      await updateData(`Students/${student.studentName}`, { image: imageUrl })
        .then(() => {
          AddNotify({ AddTitle: "Rasm yuklandi!" })
        })
        .catch((err) => {
          console.error(err)
        })

    } catch (err) {
      console.error(err);
    }
  };

  const handleStudentImgChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // 1. Firebase'dan eski rasm URL ni olamiz
      const snapshot = await readData(`Students/${student.studentName}`);
      const oldImageUrl = snapshot?.image;

      // 2. Agar eski rasm Supabase'dan bo‘lsa — o‘chirib tashlaymiz
      if (oldImageUrl?.includes('supabase.co')) {
        const filePath = oldImageUrl.split('/').pop().split('?')[0]; // Fayl nomini ajratib olamiz
        await supabase.storage.from('studentimages').remove([filePath]);
      }

      // 3. Yangi rasmni yuklaymiz
      const newImageUrl = await uploadImage(file);

      // 4. Firebasega yangi rasm linkini yozamiz
      await updateData(`Students/${student.studentName}`, { image: newImageUrl })
        .then(() => {
          AddNotify({ AddTitle: "Rasm yangilandi!" })
        })
        .catch((err) => {
          console.error(err)
        })



    } catch (err) {
      console.error(err);
    }
  };

  if (!student) return <span>Not Found</span>

  return (
    <>

      <ToastContainer />

      {
        OpenDelateModal ? <Modal
          isOpen={OpenDelateModal}
          onClose={CloseDelateModal}
          title={"O'quvchi rostdan ham o'chirilsinmi?"}
          positionTop="top-[40%]"
          children={
            <div className="flex justify-center items-center gap-5">
              <Button onClick={handleDelateStudent} className="px-6 py-2 text-lg" variant="red">Ha</Button>
              <Button onClick={() => setOpenDelateModal(false)} className="px-6 py-2 text-lg" variant="outline">Yo'q</Button>
            </div>
          }
        /> : ""
      }

      {
        OpenImg ? (
          <div
            className="w-full h-screen absolute bg-black/50 backdrop-blur-[2px] flex justify-center items-center z-40"
            onClick={() => setOpenImg(false)}
          >
            <X className="absolute right-5 top-5 cursor-pointer" color="white" size={30} onClick={() => setOpenImg(false)} />
            <img className="w-[300px] h-[300px] rounded-sm object-cover" src={student.image} alt="User image" />
          </div>
        ) : ""
      }

      <SidebarProvider>
        {isEditModalOpen && (
          <div
            className="fixed w-full h-[100vh] bg-black/50 backdrop-blur-[2px] z-30 inset-0 transition-all duration-900 ease-in-out"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
        )}
        <Sidebar
          className={`fixed inset-y-0 right-0 z-50 w-[400px] border-l border-gray-300 bg-white transition-transform duration-300 ease-in-out ${isEditModalOpen ? "translate-x-0" : "translate-x-full"}`}
          side="right"
          collapsible="none"
        >
          <SidebarHeader className="flex items-center justify-between border border-gray-300 p-4">
            <h2 className="text-lg font-normal">
              O'quvchi ma'lumotlarini o'zgartirish
            </h2>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </SidebarHeader>
          <SidebarContent className="space-y-6 p-6 text-left">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">
                Ismi
              </Label>
              <Input
                id="name"
                type="text"
                className={style.input}
                placeholder="O'quvchi ismi"
                value={chengeStudentInfo.name}
                onChange={(e) => setchengeStudentInfo({ ...chengeStudentInfo, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="number">
                Telefon raqami
              </Label>
              <Input
                id="number"
                type="text"
                className={style.input}
                placeholder="Telefon raqam"
                value={chengeStudentInfo.number}
                onChange={(e) =>
                  setchengeStudentInfo({
                    ...chengeStudentInfo,
                    number: formatPhoneNumber(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="login">
                Login
              </Label>
              <Input
                id="login"
                type="text"
                className={style.input}
                placeholder="Login"
                value={chengeStudentInfo.login}
                onChange={(e) =>
                  setchengeStudentInfo({
                    ...chengeStudentInfo,
                    login: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="parol">
                Parol
              </Label>
              <Input
                id="parol"
                type="text"
                className={style.input}
                placeholder="Parol"
                value={chengeStudentInfo.parol}
                onChange={(e) =>
                  setchengeStudentInfo({
                    ...chengeStudentInfo,
                    parol: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="date">
                Tug'ilgan sanasi
              </Label>
              <Input
                id="date"
                type="date"
                className={style.input}
                placeholder="YYYY-MM-DD"
                value={chengeStudentInfo.birthday}
                onChange={(e) => setchengeStudentInfo({ ...chengeStudentInfo, birthday: e.target.value })}
              />
            </div>
            <Button
              variant="outline"
              className="bg-blue-700 text-white"
              onClick={handleUptadeStudent}
            >
              Saqlash
            </Button>
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
          <Button className="flex justify-center gap-2" onClick={() => navigate("/students")}>
            <FaArrowLeft />
            Qaytish
          </Button>
          <div className={style.studentActive}>
            <div className="w-full rounded-lg sticky top-3 bg-white shadow">
              {/* Balance Header */}
              <div className="bg-[#6366F1] p-4 rounded-t-lg font-bold flex justify-end">
                <span className={`bg-white px-3 py-1 rounded-full text-sm ${student.balance > 0 ? "text-green-500" : "text-red-500"}`}>
                  {new Intl.NumberFormat("uz-UZ").format(student.balance)} so'm

                </span>
              </div>

              {/* Profile Content */}
              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="flex gap-4 items-center">
                  {
                    student.image !== "" ? (
                      <div className="flex flex-col w-20 h-20 overflow-hidden relative">
                        <img
                          className={`${style.img} w-20 h-20 rounded-lg object-cover cursor-pointer`}
                          src={student.image}
                          onClick={() => setOpenImg(true)}
                          alt="User image"
                        />
                        <Label
                          className={`${style.chengeImage} bg-black/60 w-full h-5 absolute rounded-lg flex justify-center items-center cursor-pointer -bottom-6`}
                          htmlFor="file"
                        >
                          <FaCamera size={15} color='#fff' />
                        </Label>
                        <Input
                          id="file"
                          type="file"
                          className="hidden"
                          onChange={(e) => handleStudentImgChange(e)}
                        />
                      </div>
                    ) : (
                      <>
                        <Label htmlFor="file" className="w-20 h-20 pb-2 bg-[#e3e3e3] text-[#7e7e7e] cursor-pointer rounded-lg flex flex-col items-center justify-end text-sm font-semibold">
                          <FiDownload size={20} />
                          Yuklash
                        </Label>
                        <Input
                          id="file"
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e)}
                        />
                      </>
                    )
                  }
                  <div className="space-y-1">
                    <h3 className="text-xl font-med ium text-gray-900">
                      {student.studentName}
                    </h3>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs border border-red-200 text-red-500">
                      Baho: 0.00
                    </span>
                    <p className="text-sm text-gray-500">ID: {student.id}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Telefon raqam :</p>
                  <p className="text-gray-900 text-[17px]">
                    {student.studentNumber}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Tug'ilgan sana :</p>
                  <p className="text-gray-900 text-[17px]">
                    {student.birthday || "Ma'lumot mavjud emas"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid gap-3">
                    <Button
                      onClick={() => setIsOpen(true)}
                      className="w-full bg-[#6366F1] hover:bg-[#5558DD] text-white gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      GURUHGA QO'SHISH
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-[#6365f11f] hover:border-[#393cf6] border-[#9193f5] text-[#6366F1]"
                      onClick={() => setIsPaymentModalOpen(true)} // Modalni ochish
                    >
                      TO'LOV QILISH
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-red-500 border-red-300 hover:bg-red-50 hover:border-red-500"
                    onClick={() => setIsRefundModalOpen(true)} // Modalni ochish
                  >
                    PUL QAYTARISH
                  </Button>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="w-full hover:bg-[#6365f11f] hover:border-[#393cf6]  border-[#9193f5]"
                    >
                      <MessageSquare className="h-5 w-5 text-[#6366F1]" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-[#6365f11f] hover:border-[#393cf6] border-[#9193f5]"
                      onClick={() => {
                        setchengeStudentInfo({
                          name: student.studentName || "",
                          birthday: student.birthday || "",
                          number: student.studentNumber || "",
                          login: student.login || "",
                          parol: student.parol || "",
                        });
                        setIsEditModalOpen(true); // Update onClick handler
                      }}
                    >
                      <PenSquare className="h-5 w-5 text-[#6366F1]" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-[#6365f11f] hover:border-[#393cf6] border-[#9193f5]"
                      onClick={() => {
                        setOpenDelateModal(true)
                      }}
                    >
                      <FaRegTrashAlt className="h-5 w-5 text-[#6366F1]" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.students}>
            <main className="w-full col-[1/4]">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
              {activeTab === "groups" && student && <CourseGrid student={student} />}
              {activeTab === "notes" && <Comments studentInfo={student} />}
              {activeTab === "history" && <StudentHistory student={student} />}
            </main>
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          positionTop={"top-[20%]"}
          onClose={() => setIsOpen(false)}
          title="Guruhga biriktirish"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Guruhni tanlang</label>
              <SelectReact
                options={groupsData.map((group) => ({
                  value: group,
                  label: `${group}  `,
                }))}
                onChange={(selectedOption) => setGroupName(selectedOption.value)}
                placeholder="Guruh tanlang"
                defaultValue={
                  groupsData.length > 0
                    ? {
                      value: groupsData[0],
                      label: `${groupsData[0]}`,
                    }
                    : null
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500">Qo'shilish sanasi</label>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-[var(--input)] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500">Izoh</label>
              <Textarea
                placeholder="Izoh kiriting..."
                className="min-h-[100px]"
              />
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <Button
                className="bg-[#6366F1] hover:bg-[#5558DD] text-white px-8"
                onClick={addStudentToGroup}
              >
                SAQLASH
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="px-8"
              >
                ORQAGA
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title="To'lov qilish"
          positionTop={"top-[35%]"}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-500">To'lov miqdori</label>
              <Input
                type="text"
                value={paymentAmount}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\s/g, ""); // Bo'sh joylarni olib tashlash
                  if (isNaN(rawValue)) return; // Faqat raqamlarni qabul qilish

                  const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Har 3 ta raqamdan keyin bo'sh joy qo'shish
                  setPaymentAmount(formattedValue)
                }}
              />
            </div>
            <div className="mt-6 flex gap-3 justify-center">
              <Button
                className="bg-[#6366F1] hover:bg-[#5558DD] text-white px-8"
                onClick={handlePayment}
              >
                TO'LOV QILISH
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-8"
              >
                BEKOR QILISH
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          title="Pul qaytarish"
          positionTop={"top-[35%]"}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Qaytariladigan miqdor</label>
              <Input
                type="text"
                value={refundAmount}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\s/g, ""); // Bo'sh joylarni olib tashlash
                  if (isNaN(rawValue)) return; // Faqat raqamlarni qabul qilish

                  const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Har 3 ta raqamdan keyin bo'sh joy qo'shish
                  setRefundAmount(formattedValue)
                }}
              />
            </div>
            <div className="mt-6 flex gap-3 justify-center">
              <Button
                className="bg-[#6366F1] hover:bg-[#5558DD] text-white px-8"
                onClick={handleRefund}
              >
                PUL QAYTARISH
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsRefundModalOpen(false)}
                className="px-8"
              >
                BEKOR QILISH
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default StudentDetail;
