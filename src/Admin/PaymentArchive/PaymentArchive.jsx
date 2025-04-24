import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
    getDatabase,
    ref,
    onValue,
    set,
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
export const database = getDatabase(app);


import { CreditCard } from "lucide-react";
import { SidebarPanel } from "../../Sidebar";
import { Button } from "../../components/ui/button";
import { MdOutlinePayments } from "react-icons/md";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Modal } from "../../components/ui/modal";

import React, { useEffect, useState } from "react";

const PaymentArchive = () => {
    const [TakeStudents, setTakeStudents] = useState([])
    const [OpenModal, setOpenModal] = useState(false)
    const [StudentKeys, setStudentKeys] = useState({});
    const [SearchStudens, setSearchStudens] = useState([]);

    const [PayValue, setPayValue] = useState({
        value1: "",
        value2: ""
    })

    useEffect(() => {
        const StudentRef = ref(database, "Students");

        const unsubscribe = onValue(StudentRef, (snapshot) => {
            const data = snapshot.val();
            const studentsArray = data ? Object.values(data) : [];

            setTakeStudents(studentsArray);
            setStudentKeys(Object.keys(data || {}));
        });

        return () => unsubscribe(); // Kuzatuvni tozalash
    }, []);

    // Talabalarni qidirish funksiyasi
    const handleSearchStudent = (searchTerm) => {
        if (!searchTerm) {
            setSearchStudens([]);
            return;
        }

        const filteredStudents = TakeStudents.filter((student) =>
            student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchStudens(filteredStudents); // Faqat filtrlangan natijalarni o'rnating
    };

    // Talabani bosilganda inputga qo'shish funksiyasi
    const handleStudentClick = (studentName) => {
        if (PayValue.value2) {
            setPayValue((prevState) => ({
                ...prevState,
                value2: studentName
            }))
        }

        const selectedStudent = TakeStudents.filter((student) => student.studentName === studentName);
        setSearchStudens(selectedStudent); // Faqat bosilgan talaba bilan natijalarni yangilash
    };

    // Talabaga to'lov qilish funksiyasi
    const handleStudentFee = () => {
        const studentRef = ref(database, `Students/${PayValue.value2}`);

        // Bo'sh joylarni olib tashlab, raqamga aylantirish
        const paymentAmount = parseInt(PayValue.value1.replace(/\s/g, ""), 10);

        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            console.error("To'lov miqdori noto'g'ri:", PayValue.value1);
            return;
        }

        get(studentRef).then((snapshot) => {
            if (snapshot.exists()) {
                const studentData = snapshot.val();
                const currentBalance = studentData.balance || 0;
                const updatedBalance = currentBalance + paymentAmount;

                update(studentRef, { balance: updatedBalance })
                    .then(() => {
                        setOpenModal(false);
                        setPayValue({ value1: "", value2: "" });
                        setSearchStudens([]);
                        console.log(`Balans muvaffaqiyatli yangilandi: ${updatedBalance}`);
                    })
                    .catch((error) => {
                        console.error("Firebase yozish xatosi:", error);
                    });
            } else {
                console.error("Talaba topilmadi:", PayValue.value2);
            }
        }).catch((error) => {
            console.error("Firebase o'qish xatosi:", error);
        });
    };

    return (
        <>
            {
                OpenModal && (
                    <Modal
                        title="To'lov qilish"
                        isOpen={OpenModal}
                        onClose={() => setOpenModal(false)}
                        positionTop={"t-[40px]"}
                        children={
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="pay" className="text-sm/3 text-gray-400">To'lov miqdori</Label>
                                    <Input
                                        id="pay"
                                        type="text"
                                        className="placeholder-gray-500 text-black"
                                        placeholder="To'lovni kiriting"
                                        value={PayValue.value1}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\s/g, ""); // Bo'sh joylarni olib tashlash
                                            if (isNaN(rawValue)) return; // Faqat raqamlarni qabul qilish

                                            const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Har 3 ta raqamdan keyin bo'sh joy qo'shish
                                            setPayValue((prevState) => ({
                                                ...prevState,
                                                value1: formattedValue,
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="who" className="text-sm/3 text-gray-400">Kimga</label>
                                    <Input
                                        id="who"
                                        type="search"
                                        placeholder="Talaba ismini qidiring..."
                                        value={PayValue.value2}
                                        onChange={(e) => {
                                            setPayValue((prevState) => ({
                                                ...prevState,
                                                value2: e.target.value
                                            }))
                                            handleSearchStudent(e.target.value)
                                        }}
                                    />
                                </div>
                                <div
                                    className={`flex flex-col gap-2 ${SearchStudens.length > 0 ? "h-auto" : SearchStudens.length < 4 ? "h-auto overflow-y-scroll" : ""}`}
                                >
                                    {SearchStudens.length > 0 ? (
                                        SearchStudens.map((student) => (
                                            <div
                                                key={student.id}
                                                className="flex justify-between items-center p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleStudentClick(student.studentName)} // Div bosilganda ismni inputga qo'shish
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{student.studentName}</span>
                                                    <span className="text-sm text-gray-500">{student.studentNumber}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : ""
                                    }
                                </div>
                                <div className="flex justify-between items-center gap-10">
                                    <Button
                                        variant="outline"
                                        onClick={() => setOpenModal(false)}
                                    >
                                        Bekor qilish
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleStudentFee()
                                        }}
                                    >
                                        To'lash
                                        <CreditCard className="w-4 h-4 mr-2" />
                                    </Button>
                                </div>
                            </div>
                        }
                    />
                )
            }

            <div className="PaymentArchive">
                <SidebarPanel />

                <div
                    className="payment-archive"
                    style={{
                        marginLeft: "var(--sidebar-width, 250px)",
                        width: "var(--sidebar-width), 100%",
                        transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
                    }}
                >
                    <nav className="flex justify-between pt-8 items-center p-6">
                        <h1 className="text-3xl font-normal">To'lovlar tarixi</h1>
                        <div className="flex gap-4">
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => setOpenModal(true)}
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                To'lov qilish
                            </Button>
                            <Button variant="red" className="flex items-center gap-2">
                                <MdOutlinePayments />
                                Pul yechish
                            </Button>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default PaymentArchive