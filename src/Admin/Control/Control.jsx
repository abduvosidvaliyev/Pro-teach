import React, { useState } from 'react';
import style from './Control.module.css';
import { Link } from 'react-router-dom';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

function Control() {
    const [secretPass, setSecretPass] = useState('');
    const [name, setName] = useState('');
    const [addBall, setAddBall] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 

        const secretPassRef = ref(database, 'secretPass');

        const newSecretPassRef = push(secretPassRef);
        set(newSecretPassRef, {
            secretPass: secretPass,
            isUsed: false,
            open: true
        })
            .then(() => {
                alert('SecretPass added successfully');
                setSecretPass(''); 
            })
            .catch((error) => {
                console.error('Error adding secretPass: ', error);
            });
    };

    const save = () => {
        if (name && addBall) {
            set(ref(database, 'Users/' + name + addBall), {
                name: name,
                ball: addBall
            }).then(() => {
                alert("User saved successfully");
                setName(''); 
                setAddBall('');
            }).catch((error) => {
                console.error("Error saving data: ", error);
            });
        } else {
            alert("Please enter a valid name and ball.");
        }
    };

    return (
        <div className="control">
            <div className={`${style.sidebar} ${isCollapsed ? style.collapsed : ''}`}>
                <div className={style.sidebarHeader}>
                    <h3 className={style.brand}>
                        <i className="fas fa-anchor"></i>
                        <span>MyApp</span>
                    </h3>
                    <div className={style.toggleBtn} onClick={toggleSidebar}>
                        <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} ${style.toggleIcon}`}></i>
                    </div>
                </div>
                <ul className={style.navLinks}>
                    <li>
                        <Link to="/panel" className={style.navItem}>
                            <span className={style.navIcon}><i className="fas fa-home"></i></span>
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/control" className={style.navItem}>
                            <span className={style.navIcon}><i className="fa-solid fa-sliders"></i></span>
                            <span>Boshqaruv</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/groups" className={style.navItem}>
                            <span className={style.navIcon}><i className="fas fa-users"></i></span>
                            <span>Guruhlar</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className={style.navItem}>
                            <span className={style.navIcon}><i className="fas fa-user"></i></span>
                            <span>Profile</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/dashboard" className={style.navItem}>
                            <span className={style.navIcon}><i className="fa-solid fa-chart-line"></i></span>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className={`${style.dropdown} ${activeDropdown === 0 ? style.active : ''}`}>
                        <a href="#" className={`${style.navItem} ${style.dropdownToggle}`} onClick={() => toggleDropdown(0)}>
                            <div>
                                <span className={style.navIcon}><i className="fas fa-cogs"></i></span>
                                <span>Settings</span>
                            </div>
                            <i className={`fas ${activeDropdown === 0 ? 'fa-chevron-down' : 'fa-chevron-right'} ${style.dropdownIcon}`}></i>
                        </a>
                        <ul className={style.dropdownMenu}>
                            <li><a href="#" className={style.dropdownItem}>General</a></li>
                            <li><a href="#" className={style.dropdownItem}>Privacy</a></li>
                            <li><a href="#" className={style.dropdownItem}>Notifications</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className={style.mainControl}
                style={{
                    marginLeft: isCollapsed ? '6%' : '250px',
                    width: isCollapsed ? 'calc(100% - 6%)' : 'calc(100% - 250px)',
                    transition: 'all 0.5s ease, background 0.3s ease, width 0.5s ease'
                }}>
                <h2>Control Panel</h2>


                <div className={style.formGroup}>
                    <div className={style.userAdd}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="addBall">Ball:</label>
                        <input
                            type="text"
                            id="addBall"
                            value={addBall}
                            onChange={(e) => setAddBall(e.target.value)}
                        />
                        <button onClick={save}>Save User</button>
                    </div>
                    <form className={style.secretPassAdd} onSubmit={handleSubmit}>
                        <label htmlFor="secretPass">Secret Pass:</label>
                        <input
                            type="text"
                            id="secretPass"
                            value={secretPass}
                            onChange={(e) => setSecretPass(e.target.value)}
                        />
                        <button type="submit">Add Secret Pass</button>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default Control;