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
const database = getDatabase(app);

import Person from "../../assets/Person.png"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { useEffect, useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";

const ProfileCard = () => {

    const [GetStudent, setGetStudent] = useState([])
    const [Student, setStudent] = useState({})
    const [OpenCard, setOpenCard] = useState(false)
    const [modal, setModal] = useState(false)

    const StudentData = JSON.parse(localStorage.getItem("StudentData"))

    useEffect(() => {
        const studentRef = ref(database, "Students")

        onValue(studentRef, (snapshot) => {
            const data = snapshot.val()

            setGetStudent(Object.values(data || []))
        })
    }, [])

    useEffect(() => {
        const findStudent = GetStudent.find(student => student.id === StudentData.id)

        setStudent(findStudent)
    }, [GetStudent, StudentData])

    useEffect(() => {
        if (OpenCard) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [OpenCard]);

    const CloseModal = () => setModal(false)

    const handleCloseUser = () => {
        localStorage.removeItem("StudentData")
        window.location.reload()
    }

    return (
        <div>
            {
                modal ? <Modal
                    isOpen={modal}
                    onClose={CloseModal}
                    title="Hisobdan chiqish"
                    positionTop="top-[40%]"
                    children={
                        <div className="flex justify-center items-center gap-8">
                            <Button
                                variant="red"
                                className="flex items-center gap-1"
                                onClick={handleCloseUser}
                            >
                                Chiqish
                                <HiArrowLeftStartOnRectangle size={23} />
                            </Button>
                            <Button variant="outline">Bekor qilish</Button>
                        </div>
                    }
                /> : ""
            }

            {
                OpenCard ? (
                    <div className={`w-full h-screen absolute z-30 left-0`} onClick={() => setOpenCard(false)}></div>
                ) : ""
            }
            <div className="relative">
                <div
                    className="w-[45px] h-[45px] flex justify-center items-center rounded-full bg-slate-200 cursor-pointer"
                    onClick={() => setOpenCard(true)}
                >
                    <img src={Person} alt="" className="w-[35px] h-[35px]" />
                </div>
                {
                    OpenCard ? (
                        <Card className="absolute w-[200px] right-0 px-2 z-40">
                            <CardHeader className="border-b border-b-gray-300 w-full pb-[3px] flex flex-col justify-start items-center">
                                <div className="flex justify-center items-center p-[5px] bg-slate-200 rounded-full">
                                    <img src={Person} alt="" className="w-[50px] h-[50px]" />
                                </div>
                                <h3>
                                    {Student?.studentName}
                                </h3>
                            </CardHeader>
                            <CardContent className="w-full pl-[5px] pt-[8px] flex flex-col justify-start gap-2 text-slate-800">
                                <h3 className="text-lg flex items-center gap-1 cursor-pointer" >
                                    <IoPersonCircleOutline size={23} />
                                    Profil
                                </h3>
                                <h3
                                    className="text-base flex items-center gap-1 text-red-700 cursor-pointer"
                                    onClick={() => setModal(true)}
                                >
                                    Chiqish
                                    <HiArrowLeftStartOnRectangle size={22} />
                                </h3>
                            </CardContent>
                        </Card>
                    ) : ""
                }
            </div>
        </div>
    )
}

export default ProfileCard