import { useState, useEffect } from 'react';
import style from './Reg.module.css';
import { FaEye, FaEyeSlash } from "react-icons/fa"

import bgVideo from '../assets/class.mp4';
import { useNavigate } from 'react-router-dom';
import { onValueData } from "../FirebaseData";

function SignUpForm({ setUserData }) {
    const navigate = useNavigate()
    const [loginName, setLoginName] = useState('');
    const [Logo, setLogo] = useState("")
    const [loginSecretPass, setLoginSecretPass] = useState('');
    const [GetAdmins, setGetAdmins] = useState([])
    const [GetStudents, setGetStudents] = useState([])
    const [inputType, setinputType] = useState("password")

    useEffect(() => {
        onValueData("Admins", (data) => {
            setGetAdmins(Object.values(data || []))
        })

        onValueData("Students", (data) => {
            setGetStudents(Object.values(data || []))
        })

        onValueData("System/CompanyInfo/logo", (data) => {
            setLogo(Object.values(data || []))
        })
    }, [])

    const handleLogin = () => {
        // to'g'ri bo'sh-tekshiruv
        if (loginName && loginSecretPass) {

            // Avval foydalanuvchini topamiz (admins va students uchun)
            const Admin = GetAdmins.find((admin) =>
                typeof admin.login === "string" &&
                typeof admin.parol !== "undefined" &&
                admin.login === loginName &&
                admin.parol.toString() === loginSecretPass
            );

            const Students = GetStudents.find((studet) =>
                typeof studet.login === "string" &&
                typeof studet.parol !== "undefined" &&
                studet.login.toLowerCase() === loginName.toLowerCase() &&
                studet.parol.toString() === loginSecretPass
            );

            // Ikkalasidan hech biri topilmasa xato xabarini ko'rsatib tugatamiz
            if (!Admin && !Students) {
                alert("Ushbu foydalanuvchi topilmadi!");
                return;
            }

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
            }
            else if (Students) {
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
                </div>
            </div>
        </div >
    );
}

export default SignUpForm;