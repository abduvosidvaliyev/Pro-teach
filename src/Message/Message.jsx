import { useState, useEffect } from 'react';
import back from '../assets/bac.mp4';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue, push, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import styles from "./Message.module.css"
import BasicNavbar from '../Basic/BasicNavbar';

const firebaseConfig = {
    apiKey: "AIzaSyC94X37bt_vhaq5sFVOB_ANhZPuE6219Vo",
    authDomain: "project-pro-7f7ef.firebaseapp.com",
    databaseURL: "https://project-pro-7f7ef-default-rtdb.firebaseio.com",
    projectId: "project-pro-7f7ef",
    storageBucket: "project-pro-7f7ef.firebasestorage.app",
    messagingSenderId: "782106516432",
    appId: "1:782106516432:web:d4cd4fb8dec8572d2bb7d5",
    measurementId: "G-WV8HFBFPND"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const Message = () => {
    const StudentData = JSON.parse(localStorage.getItem("StudentData"))
    const [Students, setStudents] = useState([])
    const [Groups, setGroups] = useState([])
    const [Student, setStudent] = useState({})
    const [Group, setGroup] = useState({})

    useEffect(() => {
        const studentRef = ref(database, "Students")

        onValue(studentRef, (snapshot) => {
            const data = snapshot.val()

            setStudents(Object.values(data || []))
        })

        const groupRef = ref(database, "Groups")

        onValue(groupRef, (snapshot) => {
            const data = snapshot.val()

            setGroups(Object.values(data || []))
        })
    }, [])


    useEffect(() => {
        const student = Students.find(student => student.id === StudentData.id)

        setStudent(student)
    }, [StudentData, Students])

    useEffect(() => {
        const group = Groups.find(group => group.groupName === Student?.group)

        setGroup(group)
    }, [Student, Groups])

    console.log(Group?.groupName)    

    return (
        <div>
            <video autoPlay loop>
                <source src={back} />
            </video>
            <div className="flex justify-between w-full">
                <BasicNavbar />
                <div className="w-[80%] px-2 flex flex-col h-screen">
                    <nav className="w-full bg-[#ffffff17] px-4 shadow-xl border border-[#ffffff4d] rounded-b-[15px] backdrop-blur-[5px] h-[120px]">
                        <div className="flex">
                            {
                                Group?.groupName ? (
                                    <h3>
                                        {Group?.groupName}
                                    </h3>
                                ) : (
                                    <h3>
                                        Yuklanmoqda!
                                    </h3>
                                )
                            }
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Message;