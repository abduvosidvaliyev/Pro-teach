import style from "./App.module.css"
import back from '../assets/bac.mp4'
import '@fortawesome/fontawesome-free/css/all.min.css';

import BasicNavbar from "./BasicNavbar";
import { useEffect, useState } from "react";
import ProfileCard from "./StudentProfile/ProfileCard";
import { onValueData } from "../FirebaseData";

function App() {
    const StudentData = JSON.parse(localStorage.getItem("StudentData"))
    const [Students, setStudents] = useState([])

    useEffect(() => {
        onValueData("Students", (data) => {
            setStudents(Object.values(data || []))
        })

    }, [])


    return (
        <>
            <video autoPlay={true} loop={true}>
                <source src={back} />
            </video>
            <div className="flex justify-between w-full">
                <BasicNavbar />
                <div className="w-[80%] flex flex-col items-end p-5 gap-10">
                    <ProfileCard />
                    <div className="w-full flex justify-evenly">
                        <div className={`${style.levels} h-[550px] pt-3`}>
                            <h1>1-Daraja</h1>
                            <div className={style.table}>
                                {
                                    Students.length > 0 ? (
                                        Students.filter((student) => student.ball >= 60)
                                            .sort((a, b) => b.ball - a.ball)
                                            .map((student) => (
                                                <div
                                                    className={`flex w-full justify-between p-1 rounded capitalize ${student.id === StudentData.id
                                                        ? "text-gray-800 bg-gray-400/50"
                                                        : "border-b border-b-stone-700"}`
                                                    }
                                                >
                                                    <h3>
                                                        {student.studentName}
                                                    </h3>
                                                    <h3>
                                                        {student.ball}
                                                    </h3>
                                                </div>
                                            ))
                                    ) : (
                                        <h1>Yuklanmoqda!</h1>
                                    )
                                }
                            </div>
                        </div>
                        <div className={`${style.levels} h-[550px] pt-3`}>
                            <h1>2-Daraja</h1>
                            <div className={style.table}>
                                {
                                    Students.length > 0 ? (
                                        Students.filter((student) => student.ball >= 30 && student.ball < 60)
                                            .sort((a, b) => b.ball - a.ball)
                                            .map((student) => (
                                                <div className={`flex w-full justify-between p-1 rounded capitalize ${student.id === StudentData.id
                                                    ? "text-gray-800 bg-gray-400/50"
                                                    : "border-b border-b-stone-700"}`}>
                                                    <h3>
                                                        {student.studentName}
                                                    </h3>
                                                    <h3>
                                                        {student.ball}
                                                    </h3>
                                                </div>
                                            ))
                                    ) : (
                                        <h1>Yuklanmoqda!</h1>
                                    )
                                }
                            </div>
                        </div>
                        <div className={`${style.levels} h-[550px] pt-3`}>
                            <h1>3-Daraja</h1>
                            <div className={style.table}>
                                {
                                    Students.length > 0 ? (
                                        Students.filter((student) => student.ball <= 30 && student.ball >= 0)
                                            .sort((a, b) => b.ball - a.ball)
                                            .map((student) => (
                                                <div className={`flex w-full justify-between p-1 rounded capitalize ${student.id === StudentData.id
                                                    ? "text-gray-800 bg-gray-400/50"
                                                    : "border-b border-b-stone-700"}`}>
                                                    <h3>
                                                        {student.studentName}
                                                    </h3>

                                                    <h3>
                                                        {student.ball}
                                                    </h3>
                                                </div>
                                            ))
                                    ) : (
                                        <h1 className="w-full">Yuklanmoqda!</h1>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;