import style from './Users.module.css';
import { SidebarPanel } from '../../Sidebar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
    getDatabase,
    ref,
    onValue,
    set,
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

import UserPng from "../../assets/Avatar.png"
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "../../components/ui/sidebar";
import { Label } from "../../components/ui/label";
import { X } from "lucide-react";

const Users = () => {
    const navigate = useNavigate();
    const [takeTeacher, setTakeTeacher] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [addUser, setaddUser] = useState({
        name: "",
        number: "",
        email: "",
        job: "",
    });

    useEffect(() => {
        const teacherRef = ref(database, "Teachers");
        onValue(teacherRef, (snapshot) => {
            const data = snapshot.val();

            setTakeTeacher(Object.values(data || {}));
        });
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleNextPage = (id) => {
        navigate(`/users/${id}`);
    };

    const handleSearchUser = (value) => {
        const teacherRef = ref(database, "Teachers");
        onValue(teacherRef, (snapshot) => {
            const data = snapshot.val();
            const filteredData = Object.values(data || {}).filter((teacher) =>
                teacher.name.toLowerCase().includes(value.toLowerCase()) || teacher.number.toLowerCase().includes(value.toLowerCase())
            );
            setTakeTeacher(filteredData);
        });
    };

    const handleAddUser = () => {
        if (!addUser.name || !addUser.number || !addUser.email || !addUser.job) {
            alert("Barcha maydonlarni to'ldiring!");
            return;
        }

        set(ref(database, `Teachers/Teacher${takeTeacher.length + 1}`), {
            id: takeTeacher.length + 1,
            name: addUser.name,
            number: addUser.number,
            email: addUser.email,
            job: addUser.job,
        })
            .then(() => {
                alert("Xodim muvaffaqiyatli qo'shildi!");
                setaddUser({
                    name: "",
                    number: "",
                    email: "",
                    job: "",
                });
            })
            .catch((error) => {
                console.error("Xodim qo'shishda xatolik:", error);
            })

    };

    return (
        <>

            <SidebarProvider>
                {isOpen && (
                    <div
                        className="fixed w-full h-[100vh] bg-black/50 backdrop-blur-[2px] z-30 inset-0 transition-all duration-900 ease-in-out"
                        onClick={toggleSidebar}
                    ></div>
                )}
                <Sidebar
                    className={`fixed inset-y-0 right-0 z-50 w-[400px] border-l border-gray-300 bg-white transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    side="right"
                    collapsible="none"
                >
                    <SidebarHeader className="flex items-center justify-between border border-gray-300 p-4">
                        <h2 className="text-lg font-normal">Xodim qo'shish</h2>
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
                                    placeholder="Xodim nomi"
                                    onChange={(e) =>
                                        setaddUser((prevState) => ({
                                            ...prevState,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="coursePrice" className="text-xs text-gray-500">Telifon raqami</Label>
                                <Input
                                    id="coursePrice"
                                    placeholder="+998 XX XXX XX XX"
                                    type="text"
                                    value={addUser.number}
                                    onFocus={(e) => {
                                        // Agar qiymat bo'sh bo'lsa, `+998` ni avtomatik qo'shish
                                        if (!addUser.number) {
                                            setaddUser((prevState) => ({
                                                ...prevState,
                                                number: "+998 ",
                                            }));
                                        }
                                    }}
                                    onChange={(e) => {
                                        const formattedNumber = e.target.value.replace(
                                            /(\d{2})(\d{3})(\d{2})(\d{2})/,
                                            "$1 $2 $3 $4"
                                        );

                                        // Holatni yangilash
                                        setaddUser((prevState) => ({
                                            ...prevState,
                                            number: formattedNumber
                                        }));
                                    }}
                                    maxLength={17}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="courseMonth" className="text-xs text-gray-500">E-mail address</Label>
                                <Input
                                    id="courseMonth"
                                    type="text"
                                    placeholder="Kurs davomiyligi"
                                    onChange={(e) =>
                                        setaddUser((prevState) => ({
                                            ...prevState,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="courseDuration" className="text-xs text-gray-500">Yo'nalishi</Label>
                                <Input
                                    id="courseDuration"
                                    type="text"
                                    placeholder="Xodim yo'nalishi"
                                    onChange={(e) =>
                                        setaddUser((prevState) => ({
                                            ...prevState,
                                            job: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <Button
                                className="bg-blue-950 hover:opacity-80 text-white"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddUser()
                                    setIsOpen(false);
                                }}
                            >
                                Qo'shish
                            </Button>
                        </form>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>

            <div className="Users">
                <SidebarPanel />

                <div
                    className={style.users}
                    style={{
                        marginLeft: "var(--sidebar-width, 250px)",
                        width: "var(--sidebar-width), 100%",
                        transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
                    }}
                >
                    <nav className="flex justify-between pt-8 items-center p-6 rounded-lg">
                        <h2 className="text-3xl font-normal">Xodimlar</h2>
                        <div className="flex gap-4 items-center">
                            <Input
                                type="text"
                                placeholder="Qidirish..."
                                className="w-64 placeholder-gray-900"
                                onChange={(e) => handleSearchUser(e.target.value)}
                            />
                            <Button
                                className="bg-blue-950 text-white flex gap-2 items-center"
                                onClick={toggleSidebar}
                            >
                                Yangi xodim qo'shish
                                <FaPlus />
                            </Button>
                        </div>
                    </nav>
                    <div className="cards grid grid-cols-4 gap-4 px-6 py-8">
                        {
                            takeTeacher.map((teacher, index) => (
                                <Card
                                    key={index}
                                    className="flex flex-col hover:shadow-xl cursor-pointer items-center justify-center gap-3 bg-white shadow-md rounded-lg p-4"
                                    onClick={() => handleNextPage(teacher.id)}
                                >
                                    <img src={UserPng} className="w-30 h-30" alt="User picture" />
                                    <div className="w-full border-t border-gray-400 pt-7 pb-2 flex flex-col items-start justify-start gap-1">
                                        <h2 className="text-xl font-semibold">{teacher.name}</h2>
                                        <p className="text-gray-500">{teacher.number}</p>
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Users;