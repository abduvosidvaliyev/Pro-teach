// Import necessary modules
import React, { useEffect, useState } from 'react';
import style from "./App.module.css"
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import Login from '../Register&Login/Register.jsx'
import Message from '../Message/Message.jsx'
import back from '../assets/bac.mp4'

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

function App({ formData }) {
    const [users, setUsers] = useState([]);
    const [active, setActive] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [isUserName, setIsUserName] = useState(formData.name);

    const handleToggle = () => {
        setActive(!active);
    };
    useEffect(() => {
        const dbRef = ref(database, 'Users');
        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const sortedData = Object.entries(data).sort(([, a], [, b]) => parseInt(b.ball) - parseInt(a.ball));
                setUsers(sortedData);
            } else {
                console.log("No data available");
            }
        }, (error) => {
            console.error("Error getting data: ", error);
        });

    }, []);

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('userData');

        // Set logout state to true
        setIsLoggedOut(true);
    };

    const navigateToTemplates = () => {
        navigate('/templates');
    };

    if (isLoggedOut) {
        return <Login />;
    }
    return (
        <div>
            <div className={style.chat}></div>
            <aside className={style.basicAside}>
                <i className={`fa-solid fa-house ${style.icon}`}></i>
                <i onClick={navigateToTemplates} className={`fa-solid fa-layer-group ${style.icon}`}></i>
                <Link state={formData.name} to="/chat">
                    <i className={`fa-solid fa-message ${style.icon}`}></i>
                </Link>
            </aside>
            <div className={style.main}>
                <video autoPlay loop>
                    <source src={back} />
                </video>
                {[50, 20, 0].map((threshold, index) => (
                    <div className={style.levels} key={index}>
                        <h1>{index + 1}-Daraja</h1>
                        <div className={style.table}>
                            {users.filter(([key, userData]) => parseInt(userData.ball) >= threshold && parseInt(userData.ball) < (index === 0 ? Infinity : threshold + 30)).map(([key, userData]) => (
                                <div className={`${style.card} ${userData.name === localStorage.getItem('userName') ? style.highlight : ''}`} key={key}>
                                    <p>{userData.name}</p>
                                    <span>Ball: {userData.ball}</span>
                                </div>
                            ))}
                        </div>
                        <div className={style.level}>
                            <a href="">Level 1</a>
                        </div>
                    </div>
                ))}
                <div className={style.game}>🔁</div>
                <div className={style.userSettings} id="userSettings" onClick={handleToggle}>
                    ⚙️
                    {active && <div className={style.userSettingsMenu}>
                        <p>Name: {formData.name}</p>
                        <p>Surname: {formData.surname}</p>
                        <p>Group: {formData.group}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default App;