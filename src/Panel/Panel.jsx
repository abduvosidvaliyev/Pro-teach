import React, { useState, useEffect } from 'react';
import style from "./Panel.module.css";
import Basic from '../Basic/Basic.jsx';
import { FaBars } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup, faHouse } from '@fortawesome/free-solid-svg-icons';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, get, push } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { Link } from 'react-router-dom';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';

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

function Panel() {
    const [secretPass, setSecretPass] = useState('');
    const [name, setName] = useState('');
    const [addBall, setAddBall] = useState('');
    const [income, setIncome] = useState([]);
    const [uData, setUData] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [lastMonthSum, setLastMonthSum] = useState(null);
    const [lastMonthR54Data, setLastMonthR54Data] = useState(null);
    const [lastMonthM52Data, setLastMonthM52Data] = useState(null);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const sheetId = "16SEsun2iyBOzQs8HxqIVRZSLffyBQxtG0-zx164_SFw";
    const xLabels = [
        'Avgust(2024)',
        'Sentabr(2024)',
        'Oktabr(2024)',
        'Noyabr(2024)',
        'Dekabr(2024)',
    ];

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
                alert("saved");
            }).catch((error) => {
                console.error("Error saving data: ", error);
            });
        } else {
            alert("Please enter a valid name.");
        }
    };

    const fetchData = () => {
        const months = ['Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
        const promises = months.map((month) => {
            const range = 'B1';
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${month}(2024)&range=${range}`;
            return fetch(url)
                .then(res => res.text())
                .then(rep => {
                    let data = JSON.parse(rep.substr(47).slice(0, -2));
                    return data.table.rows[0].c[0].v;
                });
        });

        Promise.all(promises)
            .then(values => {
                console.log(values);
                setIncome(values);
                setUData(values);

                const lastMonthSum = values[values.length - 1];
                setLastMonthSum(lastMonthSum);
            })
            .catch(err => console.error('Error:', err));
    };

    const fetchLastMonthData = () => {
        const lastMonth = 'Dekabr(2024)';
        const ranges = ['R54', 'M52'];
        const promises = ranges.map((range) => {
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${lastMonth}&range=${range}`;
            return fetch(url)
                .then(res => res.text())
                .then(rep => {
                    let data = JSON.parse(rep.substr(47).slice(0, -2));
                    return data.table.rows[0].c[0].v;
                });
        });

        Promise.all(promises)
            .then(values => {
                setLastMonthR54Data(values[0]);
                setLastMonthM52Data(values[1]);
            })
            .catch(err => console.error('Error:', err));
    };

    useEffect(() => {
        const interval = setInterval(fetchData, 5000);
        fetchData();
        fetchLastMonthData();
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
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

            <div
                className={style.panel}
                style={{
                    marginLeft: isCollapsed ? '6%' : '250px',
                    width: isCollapsed ? 'calc(100% - 6%)' : 'calc(100% - 250px)',
                    transition: 'all 0.5s ease, background 0.3s ease, width 0.5s ease'
                }}
            >
                <div className={style.dashboardPanel}>
                    <button>To'lov</button>
                </div>

                <div className={style.line}>
                    <div className={style.users}>
                        <FontAwesomeIcon icon={faPeopleGroup} />
                        <span> Users: 54 </span>
                    </div>
                </div>
                <div className={style.panelCard}>
                    <LineChart
                        className={style.lineChart}
                        width={500}
                        height={300}
                        series={[{ data: uData, label: 'Oylik Tushum', area: true, showMark: true, color: ' #FDF1F5' },]}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                        sx={{
                            [`& .${lineElementClasses.root}`]: {
                                display: 'none',
                            },
                            [`& .${lineElementClasses.label}`]: {
                                fill: 'blue',
                            },
                            [`& .${lineElementClasses.text}`]: {
                                fill: 'blue',
                            },
                        }}
                    />
                    <div className={style.cardsDown}>
                        <div className={style.cardDown}>
                            <p>Hozirgi Hisob:</p>
                            <span>{lastMonthSum}</span>
                        </div>
                        <div className={style.cardDown}>
                            <p>Qolgan Summa:</p>
                            <span>{lastMonthM52Data}</span>
                        </div>
                        <div className={style.cardDown}>
                            <p>Qarzdorlar Soni:</p>
                            <span>{lastMonthR54Data}</span>
                        </div>
                    </div>
                </div>

                <div className={style.calendarCon}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            className={style.calendar}
                            sx={{
                                '.MuiPickersDay-root': {
                                    backgroundColor: '#FDF1F5',
                                    color: ' #EE8E46',
                                },
                                '.MuiPickersDay-root.Mui-selected': {
                                    backgroundColor: ' #EE8E46',
                                    color: '#FDF1F5',
                                },
                                '.MuiPickersDay-root:hover': {
                                    backgroundColor: '#FDF1F5',
                                },
                                '.MuiPickersDay-root.Mui-disabled': {
                                    color: 'red',
                                },
                            }}
                        />
                    </LocalizationProvider>
                </div>
                <div className={style.tasks}>
                    <ul>
                        <li>
                            <h4>Task Title</h4>
                            <p>What Task ?</p>
                        </li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Panel;
