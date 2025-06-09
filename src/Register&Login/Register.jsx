import React, { useState, useEffect } from 'react';
import style from './Reg.module.css';
import Basic from '../Basic/Basic.jsx';
import Message from '../Message/Message.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faKey, faUsersLine } from '@fortawesome/free-solid-svg-icons';

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import bgVideo from '../assets/class.mp4';
import { useNavigate } from 'react-router-dom';

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

function SignUpForm({ setUserData }) {
    const navigate = useNavigate()
    const [loginName, setLoginName] = useState('');
    const [loginSecretPass, setLoginSecretPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [GetAdmins, setGetAdmins] = useState([])
    const [GetStudents, setGetStudents] = useState([])

    useEffect(() => {
        const adminsRef = ref(database, "Admins")
        onValue(adminsRef, (snapshot) => {
            const data = snapshot.val()

            setGetAdmins(Object.values(data || []))
        })

        const studentsRef = ref(database, "Students")
        onValue(studentsRef, (snapshot) => {
            const data = snapshot.val()

            setGetStudents(Object.values(data || []))
        })
    }, [])


    const handleLogin = () => {
        if ((loginName && loginSecretPass) !== "") {
            const Admin = GetAdmins.find((admin) =>
                typeof admin.login === "string" &&
                typeof admin.parol !== "undefined" &&
                admin.login.toLowerCase() === loginName.toLowerCase() &&
                admin.parol.toString() === loginSecretPass
            );

            if (Admin) {
                localStorage.setItem("UserData", JSON.stringify({
                    id: Admin.id,
                    login: Admin.login,
                    parol: Admin.parol
                }))
                setUserData(localStorage.getItem("UserData"))
                navigate("/panel")
                setLoginName("")
                setLoginSecretPass("")
                setLoading(false)
            }
            else {
                const Students = GetStudents.find((studet) =>
                    typeof studet.login === "string" &&
                    typeof studet.parol !== "undefined" &&
                    studet.login.toLowerCase() === loginName.toLowerCase() &&
                    studet.parol.toString() === loginSecretPass
                );

                if (Students) {
                    localStorage.setItem("StudentData", JSON.stringify({
                        id: Students.id,
                        login: Students.login,
                        parol: Students.parol
                    }))
                    navigate(`/studentpages/${Students.id}`)
                    setLoginName("")
                    setLoginSecretPass("")
                    setLoading(false)
                }
            }
        }
        else {
            alert("Ma'lumotlarni to'liq kiriting!")
        }
    };

    return (
        <div className={style.container}>
            <video autoPlay loop>
                <source src={bgVideo} />
            </video>

            <div className={style.signIn}>
                <div className={style.logo}></div>
                <h1 className={style.signText}>Login<span>/</span>Akkauntga Kirish</h1>
                <div className={style.form}>
                    <div className={style.inps}>
                        <input
                            type="text"
                            placeholder='Login Kiriting'
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                        />
                        <FontAwesomeIcon className={style.faCircle} icon={faCircleUser} />
                    </div>
                    <div className={style.inps}>
                        <input
                            type="password"
                            placeholder='Parol Kiriting'
                            value={loginSecretPass}
                            onChange={(e) => setLoginSecretPass(e.target.value)}
                            onKeyUp={(e) => e.key === "Enter" ? handleLogin() : ""}
                        />
                        <FontAwesomeIcon className={style.faKey} icon={faKey} />
                    </div>
                    <button onClick={handleLogin}>Tasdiqlash</button>
                    {loading && <div className={style.loader}>Loading...</div>} {/* Loader */}
                </div>
            </div>
        </div >
    );
}

export default SignUpForm;