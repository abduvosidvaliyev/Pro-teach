import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getDatabase,
    ref,
    onValue,
    set,
    update,
    get
} from "firebase/database";

import { useState, useEffect } from 'react';
import style from './Reg.module.css';
import { FaEye, FaEyeSlash } from "react-icons/fa"

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
    const [Logo, setLogo] = useState("")
    const [loginSecretPass, setLoginSecretPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [GetAdmins, setGetAdmins] = useState([])
    const [GetStudents, setGetStudents] = useState([])
    const [inputType, setinputType] = useState("password")

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

        const systemRef = ref(database, "System/CompanyInfo/logo")
        onValue(systemRef, (snapshot) => {
            const data = snapshot.val()

            setLogo(data)
        })
    }, [])

    const handleLogin = () => {
        if ((loginName && loginSecretPass) !== "") {

            if (!GetAdmins.find(admin => admin.parol.toString() !== loginSecretPass || admin.login !== loginName) &&
                !GetStudents.find(admin => admin.parol.toString() !== loginSecretPass || admin.login !== loginName)
            ) {
                alert("Ushbu foydalanuvchi topilmadi!")
            }

            const Admin = GetAdmins.find((admin) =>
                typeof admin.login === "string" &&
                typeof admin.parol !== "undefined" &&
                admin.login === loginName &&
                admin.parol.toString() === loginSecretPass
            );

            if (Admin) {
                localStorage.setItem("UserData", JSON.stringify({
                    id: Admin.id,
                    login: Admin.login,
                    parol: Admin.parol
                }))
                localStorage.setItem("userData", JSON.stringify({
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
                    localStorage.setItem("userData", JSON.stringify({
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
                <div className={style.logo}>
                    <img src={Logo} alt="" className="w-full h-full rounded-full" />
                </div>
                <h1 className={style.signText}>Login<span>/</span>Akkauntga Kirish</h1>
                <div className={style.form}>
                    <div className={style.inps}>
                        <input
                            type="text"
                            placeholder='Login Kiriting'
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                        />

                    </div>
                    <div className={style.inps}>
                        <input
                            type={inputType}
                            placeholder='Parol Kiriting'
                            value={loginSecretPass}
                            onChange={(e) => setLoginSecretPass(e.target.value)}
                            onKeyUp={(e) => e.key === "Enter" ? handleLogin() : ""}
                        />
                        {
                            loginSecretPass
                                ? (
                                    inputType === "password"
                                        ? <FaEye
                                            className="absolute right-4 cursor-pointer text-white"
                                            size={18}
                                            onClick={() => setinputType("text")}
                                        />
                                        : <FaEyeSlash
                                            className="absolute right-4 cursor-pointer text-white"
                                            size={18}
                                            onClick={() => setinputType("password")}
                                        />
                                )
                                : ""
                        }
                    </div>
                    <button onClick={handleLogin}>Tasdiqlash</button>
                    {loading && <div className={style.loader}>Loading...</div>} {/* Loader */}
                </div>
            </div>
        </div >
    );
}

export default SignUpForm;