import React, { useState, useEffect } from 'react';
import style from './Reg.module.css';
import Basic from '../Basic/Basic.jsx';
import Message from '../Message/Message.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faKey, faUsersLine } from '@fortawesome/free-solid-svg-icons';

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import bgVideo from '../assets/bg.mp4';

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

function SignUpForm() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        group: '',
        secretPass: ''
    });
    const [isRegistered, setIsRegistered] = useState(false);
    const [active, setActive] = useState(false);
    const [loginName, setLoginName] = useState('');
    const [loginSecretPass, setLoginSecretPass] = useState('');
    const [loading, setLoading] = useState(false); // Loader holati

    useEffect(() => {
        // Check local storage for saved login state and data
        const savedData = localStorage.getItem('userData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData(parsedData);
            setIsRegistered(true);
        }
    }, []);

    const handleToggle = () => {
        setActive(!active);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleLoginChange = (e) => {
        setLoginName(e.target.value);
    };

    const handleSecretPassChange = (e) => {
        setLoginSecretPass(e.target.value);
    };

    const handleLogin = () => {
        setLoading(true); // Loaderni yoqish
        const usersRef = ref(database, 'Users');

        get(usersRef).then((snapshot) => {
            let userExists = false;

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const userData = childSnapshot.val();
                    if (userData.name === loginName && userData.secretPass === loginSecretPass) {
                        userExists = true;
                        setFormData(userData); // Set formData to the logged-in user's data
                        // Save user data to local storage
                        localStorage.setItem('userData', JSON.stringify(userData));
                    }
                });
            }

            if (userExists) {
                setIsRegistered(true);
            } else {
                alert("User not found or incorrect SecretPass.");
            }
        }).catch((error) => {
            console.error("Error checking data: ", error);
        }).finally(() => {
            setLoading(false); // Loaderni o'chirish
        });
    };

    const handleLogout = () => {
        // Clear local storage and reset state
        localStorage.removeItem('userData');
        setFormData({
            name: '',
            surname: '',
            group: '',
            secretPass: ''
        });
        setIsRegistered(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Loaderni yoqish
        const { name, surname, group, secretPass } = formData;

        if (name && surname && group !== "Guruhingizni Tanlang" && secretPass) {
            const secretPassesRef = ref(database, 'secretPass');

            get(secretPassesRef).then((snapshot) => {
                let validSecretPass = false;
                let secretPassKey = null;

                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const storedSecretPass = childSnapshot.val();
                        console.log("Checking storedSecretPass:", storedSecretPass);
                        // Ensure secretPass is open and not used
                        if (typeof storedSecretPass === 'object' &&
                            storedSecretPass.secretPass === secretPass &&
                            !storedSecretPass.isUsed &&
                            storedSecretPass.open) {
                            validSecretPass = true;
                            secretPassKey = childSnapshot.key; // Capture the key for updating
                        }
                    });
                }

                if (!validSecretPass) {
                    console.log("Entered secretPass:", secretPass);
                    alert("Invalid SecretPass.");
                    setLoading(false); // Loaderni o'chirish
                    return;
                }

                const usersRef = ref(database, 'Users');

                get(usersRef).then((snapshot) => {
                    let userExists = false;

                    if (snapshot.exists()) {
                        snapshot.forEach((childSnapshot) => {
                            const userData = childSnapshot.val();
                            if (userData.name === name && userData.surname === surname) {
                                userExists = true;
                            }
                        });
                    }

                    if (userExists) {
                        alert("User with this name and surname already exists.");
                        setLoading(false); // Loaderni o'chirish
                    } else {
                        const userKey = `${name}_${surname}_${group}_${secretPass}`;
                        const userRef = ref(database, 'Users/' + userKey);
                        alert('Akkaunt Muvaffaqiyatli  Yaratildi')
                        set(userRef, {
                            name: name,
                            surname: surname,
                            group: group,
                            ball: 0,
                            secretPass: secretPass
                        }).then(() => {
                            // Update the secretPass to mark it as used
                            if (secretPassKey) {
                                const secretPassRef = ref(database, `secretPass/${secretPassKey}`);
                                set(secretPassRef, {
                                    secretPass: secretPass,
                                    isUsed: true,
                                    open: false
                                });
                            }
                            setIsRegistered(true);
                        }).catch((error) => {
                            console.error("Error saving data: ", error);
                        }).finally(() => {
                            setLoading(false); // Loaderni o'chirish
                        });
                    }
                }).catch((error) => {
                    console.error("Error checking data: ", error);
                    setLoading(false); // Loaderni o'chirish
                });
            }).catch((error) => {
                console.error("Error checking SecretPasses: ", error);
                setLoading(false); // Loaderni o'chirish
            });
        } else {
            alert("Please fill in all fields.");
            setLoading(false); // Loaderni o'chirish
        }
    };

    if (isRegistered) {
        return (
            <div>
                <Basic formData={formData} />
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }


    return (
        <div className={style.container}>
            <video autoPlay loop>
                <source src={bgVideo} />
            </video>
            {active ?
                < div className={style.signUp} >
                    <div className={style.logo}></div>
                    <span className={style.switch} onClick={handleToggle}>Login</span>
                    <h1 className={style.signText}>Register<span>/</span>Yangi Akkaunt Ochish</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={style.inps}>
                            <input type="text" placeholder="Ismingizni Kiriting..." id="name" value={formData.name} onChange={handleChange} />
                            <FontAwesomeIcon className={style.faCircle} icon={faCircleUser} />
                        </div>
                        <div className={style.inps}>
                            <input type="text" placeholder="Familiyangizni Kiriting..." id="surname" value={formData.surname} onChange={handleChange} />
                            <FontAwesomeIcon className={style.faCircle} icon={faCircleUser} />
                        </div>
                        <div className={style.inps}>
                            <select id="group" value={formData.group} onChange={handleChange}>
                                <option value="Guruhingizni Tanlang">Guruhingizni Tanlang</option>
                                <option value="Web-1">Web-1</option>
                                <option value="Web-2">Web-2</option>
                                <option value="Web-3">Web-3</option>
                                <option value="Web-4">Web-4</option>
                                <option value="Web-5">Web-5</option>
                                <option value="Web-6">Web-6</option>
                                <option value="Web-7">Web-7</option>
                                <option value="Web-8">Web-8</option>
                                <option value="Web-9">Web-9</option>
                                <option value="Web-10">Web-10</option>
                            </select>
                            <FontAwesomeIcon className={style.userLine} icon={faUsersLine} />
                        </div>
                        <div className={style.inps}>
                            <input
                                type="password"
                                placeholder="SecretPassni Kiriting..."
                                id="secretPass"
                                value={formData.secretPass}
                                onChange={handleChange}
                            />
                            <FontAwesomeIcon className={style.faKey} icon={faKey} />
                        </div>
                        <button type="submit">Ro'yhatdan O'tish</button>
                        {loading && <div className={style.loader}>Loading...</div>} {/* Loader */}
                    </form>
                </div>
                : ""}

            {!active ?
                <div className={style.signIn}>
                    <div className={style.logo}></div>
                    <span className={style.switch} onClick={handleToggle}>Register</span>
                    <h1 className={style.signText}>Login<span>/</span>Akkauntga Kirish</h1>
                    <div className={style.form}>
                        <div className={style.inps}>
                            <input type="text" placeholder='Ismingizni Kiriting' value={loginName} onChange={handleLoginChange} />
                            <FontAwesomeIcon className={style.faCircle} icon={faCircleUser} />
                        </div>
                        <div className={style.inps}>
                            <input type="password" placeholder='SecretPassni Kiriting' value={loginSecretPass} onChange={handleSecretPassChange} />
                            <FontAwesomeIcon className={style.faKey} icon={faKey} />
                        </div>
                        <button onClick={handleLogin}>Tasdiqlash</button>
                        {loading && <div className={style.loader}>Loading...</div>} {/* Loader */}
                    </div>
                </div>
                : ""}
        </div >
    );
}

export default SignUpForm;