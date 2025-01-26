import React, { useState, useEffect } from 'react';
import { data, Link } from 'react-router-dom';
import Select from 'react-select';
import style from './Group.module.css';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue, update, push } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";


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


const days = [
    { label: 'Toq kunlar' },
    { label: 'Juft kunlar' },
    { label: 'Dam olish kuni' },
    { label: 'Har kuni' },
];

function Groups() {


    const [groups, setGroups] = useState(['Web 1', 'Web 2', 'Web 3']); // Initial groups

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isAdd, setIsAdd] = useState(true)
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [roomsData, setRoomsData] = useState([])
    const [groupInfo, setGroupInfo] = useState();
    const [groupsData, setGroupsData] = useState([])
    const [studentsData, setStudentsData] = useState([])
    const [newGroupName, setNewGroupName] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentNumber, setNewStudentNumber] = useState('');
    const [students, setStudents] = useState([]);





    const getCurrentMonthDates = () => {
        const dates = [];
        const pastMonths = []
        const months = [];
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
                dates.push(`${day} ${date.toLocaleString('en-US', { month: 'short' })}`);
            }
        }

        for (let i = 5; i >= 0; i--) {
            const pastMonth = new Date(year, month - i);
            pastMonths.push(pastMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
        }

        months.push(now.toLocaleString('en-US', { month: 'long', year: 'numeric' }));

        return { dates, months, pastMonths };
    };

    const { dates, months, pastMonths } = getCurrentMonthDates();

    const [selectedMonth, setSelectedMonth] = useState(`${months}`);


    const handleAttendance = (studentIndex, dateIndex, student, status) => {
        const newStudents = [...students, dateIndex];
        newStudents[studentIndex][`attendance`][months][dateIndex] = status;

        const studentCell = ref(database, `Students/${student.studentName}`);


        update(studentCell, {
            [`attendance/${months}/${dateIndex}`]: status
        })
            .catch((error) => {
                console.error('Error adding group to Firebase:', error);
            });

        setStudents(students);
        console.log(students);

    };

    const handleMonthClick = (month) => {
        setSelectedMonth(month);
    };


    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const toggleIsAdd = () => {
        setIsAdd(!isAdd);
    }

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleSelectChange = (selectedOption, actionMeta) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [actionMeta.name]: selectedOption
        }));
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setNewGroupName(value); // Update new group name state
        setSelectedOptions(prevState => ({
            ...prevState,
            groupName: value
        }));
    };

    const handleInputChangeNum = (event) => setNewStudentNumber(event.target.value || '');

    const addGroup = () => {
        if (newGroupName.trim() !== '') {
            const newGroup = {
                ...selectedOptions,
                groupName: newGroupName
            };

            // Add the new group to the local state
            setGroups([...groups, newGroupName]);
            setGroupsData([...groupsData, newGroup]);

            // Add the new group to Firebase
            const newGroupRef = ref(database, `Groups/${newGroupName}`);
            set(newGroupRef, newGroup)
                .then(() => {
                    console.log('Group added to Firebase:', newGroup);
                })
                .catch((error) => {
                    console.error('Error adding group to Firebase:', error);
                });


            setNewGroupName('');
        }
        console.log(groupsData);
    };

    const addStudentToGroup = () => {
        if (newStudentName.trim() === '' || newStudentNumber.trim() === '') {
            console.log('Student name and number are required');
            return;
        }

        const newStudent = {
            studentName: newStudentName,
            studentNumber: newStudentNumber,
            group: groupInfo.groupName,
            [`attendance/${months}`]: Array(dates.length).fill(false),
        };

        const userRef = ref(database, `Students/${newStudentName}`);
        update(userRef, newStudent)
            .then(() => {
                alert("Ma'lumot muvaffaqiyatli yangilandi!");
            })
            .catch((error) => {
                console.error("Xatolik yuz berdi: ", error);
            });

        setNewStudentName('');
        setNewStudentNumber('');
        toggleModal();
    };


    function handleGroupClick(groupName) {
        const groupData = groupsData.find(group => group.groupName === groupName);
        if (groupData) {
            setGroupInfo(groupData);

            // Fetch students for the selected group
            const studentsRef = ref(database, 'Students');
            onValue(studentsRef, (snapshot) => {
                const data = snapshot.val();
                const groupStudents = Object.keys(data)
                    .map(key => data[key])
                    .filter(student => student.group === groupName);

                setStudents(groupStudents);
            });
        }
    }

    // ... existing code ...

    const attendance = (studentName) => {
        const attendanceRef = ref(database, `Students/${studentName}/attendance`);

        // Get the current date
        const currentDate = new Date();

        // Format the key as "YYYY-MM-DD"
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        const attendanceData = {
            [dateKey]: { status: true }
        };

        update(attendanceRef, attendanceData)
            .then(() => {
                console.log('Attendance recorded for:', studentName);
                console.log(studentsData[0].attendance);

            })
            .catch((error) => {
                console.error('Error adding attendance to Firebase:', error);
            });
    }

    // ... existing code ...

    useEffect(() => {
        const coursesRef = ref(database, 'Teachers');
        onValue(coursesRef, (snapshot) => {
            const data = snapshot.val();
            const teacherData = Object.keys(data).map(key => ({
                value: key,
                label: data[key].name
            }));
            setTeachersData(teacherData);
        });
    }, []);

    useEffect(() => {
        const studentsRef = ref(database, 'Students');
        onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            const studentsWithAttendance = Object.keys(data).map(key => ({
                value: key,
                label: data[key].studentName,
                attendance: data[key].attendance,
                studentNumber: data[key].studentNumber,
                group: data[key].group
            }));

            setStudentsData(studentsWithAttendance);
        });
    }, []);

    useEffect(() => {
        const coursesRef = ref(database, 'Courses');
        onValue(coursesRef, (snapshot) => {
            const data = snapshot.val();
            const courseOptions = Object.keys(data).map(key => ({
                value: key,
                label: data[key].name
            }));
            setCoursesData(courseOptions);
        });
    }, []);

    useEffect(() => {
        const coursesRef = ref(database, 'Rooms');
        onValue(coursesRef, (snapshot) => {
            const data = snapshot.val();
            const roomData = Object.keys(data).map(key => ({
                value: key,
                label: data[key].name
            }));
            setRoomsData(roomData);
        });
    }, []);

    useEffect(() => {
        const groupsRef = ref(database, 'Groups');
        onValue(groupsRef, (snapshot) => {
            const data = snapshot.val();
            const groupsArray = Object.keys(data).map(key => ({
                groupName: key,
                ...data[key]
            }));
            setGroupsData(groupsArray);
        });
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
                        <Link to="/students" className={style.navItem}>
                            <span className={style.navIcon}><i className="fas fa-user"></i></span>
                            <span>Talabalar</span>
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
                            <li><i class="fa-regular fa-gem"></i><a href="#" className={style.dropdownItem}>Kurslar</a></li>
                            <li><i class="fa-solid fa-table-cells-large"></i><a href="#" className={style.dropdownItem}>Xonalar</a></li>
                            <li><i class="fa-solid fa-user-group"></i><a href="#" className={style.dropdownItem}>Xodimlar</a></li>
                        </ul>
                    </li>
                </ul>
            </div>


            <div className={style.main}
                style={{
                    marginLeft: isCollapsed ? '6%' : '250px',
                    width: isCollapsed ? 'calc(100% - 6%)' : 'calc(100% - 250px)',
                    transition: 'all 0.5s ease, background 0.3s ease, width 0.5s ease'
                }}>
                <div className={style.menu}>
                    <h1>Guruhlar: </h1>
                    <div className={style.groups}>
                        {groupsData.map((group, index) => (
                            <span key={index} onClick={() => handleGroupClick(group.groupName)}>
                                {group.groupName}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={style.groupAbout}>
                    <h2>Guruhlar soni: {groupsData.length}</h2>
                    <div className={`${style.groupAdd} ${isAdd ? style.isAdd : ''}`}>
                        <span>
                            <h2>Yangi guruh qo'shish</h2>
                            <button onClick={toggleIsAdd}>❌</button>
                        </span>
                        <hr />
                        <label htmlFor="">Nomi</label>
                        <input
                            type="text"
                            value={newGroupName} // Controlled input
                            onChange={handleInputChange}
                        />
                        <label htmlFor="">Kurs tanlash</label>
                        <Select
                            name="courses"
                            options={coursesData}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleSelectChange}
                        />
                        <label htmlFor="">O'qituvchini tanlang</label>
                        <Select
                            name="teachers"
                            options={teachersData}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleSelectChange}
                        />
                        <label htmlFor="">Kunlar</label>
                        <Select
                            name="days"
                            options={days}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleSelectChange}
                        />
                        <label htmlFor="">Xonani tanlang</label>
                        <Select
                            name="rooms"
                            options={roomsData}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleSelectChange}
                        />
                        <label htmlFor="">Darsning boshlanish vaqti</label>
                        <select className={style.selectData} name="" id="" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                            <option value="09:00">09:00</option>
                            <option value="09:30">09:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                            <option value="17:00">17:00</option>
                        </select>
                        <button onClick={addGroup}>Saqlash</button>
                    </div>
                    <button className={style.groupAddButton} onClick={toggleIsAdd}>Add Group</button>
                </div>

                <div className={style.groupActive}>
                    {groupInfo && (
                        <div className={style.groupInfo}>
                            <h1>{groupInfo.groupName}</h1>
                            <hr />
                            <div className={style.groupInfoContent}>
                                <div className={style.groupInfoContentItem}>
                                    <h2>Kurs: <span>{groupInfo.courses ? groupInfo.courses.label : 'No course selected'}</span></h2>
                                    <h2>O'qituvchi: <span>{groupInfo.teachers ? groupInfo.teachers.label : 'No teacher selected'}</span></h2>
                                    <h2>Narx: <span>{`${groupInfo.price} UZS` || 'N/A'}</span></h2>
                                    <h2>Davomiyligi: <span>{`${groupInfo.days.label}`} • {groupInfo.duration || 'N/A'}</span></h2>
                                    <h2>Room: <span>{groupInfo.rooms ? groupInfo.rooms.label : 'No room selected'}</span></h2>
                                </div>
                            </div>
                            <div className={style.crud}>
                                <i className="fa-solid fa-pen"></i>
                                <i className="fa-regular fa-trash-can"></i>
                                <i className="fa-solid fa-plus" onClick={toggleModal}></i>
                            </div>
                        </div>
                    )}
                </div>

                <div className={style.davomat}>
                    <h1>Davomat</h1>
                    <div className={style.months}>
                        {months.map((month, index) => (
                            <span
                                key={index}
                                className={month === selectedMonth ? style.active : ''}
                                onClick={() => handleMonthClick(month)}
                            >
                                {month}
                            </span>
                        ))}

                    </div>

                    <div className={style.attendanceGrid}>
                        <div className={style.header}>
                            <div className={style.nameCol}>Ism</div>
                            {dates.map((date, index) => (
                                <div key={index} className={style.dateCol}>{date}</div>
                            ))}
                        </div>

                        {students.map((student, studentIndex) => (
                            <div key={studentIndex} className={style.studentCol}>
                                <div className={style.nameCol}>{student.studentName}</div>
                                {student[`attendance`][selectedMonth] && Array.isArray(student[`attendance`][selectedMonth]) ? (
                                    student[`attendance`][selectedMonth].map((attendance, dateIndex) => (
                                        <div
                                            key={dateIndex}
                                            className={style.attendanceCell}x
                                        >
                                            <div className={`${style.circle} ${attendance === true ? style.present : attendance === false ? style.absent : ''}`}>
                                                <div className={style.hoverButtons}>
                                                    <button

                                                        className={style.yesBtn}
                                                        onClick={() => handleAttendance(studentIndex, dateIndex, student,
                                                            true
                                                        )}
                                                    >
                                                        Ha
                                                    </button>
                                                    <button
                                                        className={style.noBtn}
                                                        onClick={() => handleAttendance(studentIndex, dateIndex,
                                                            student,
                                                            false)}
                                                    >
                                                        Yo'q
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No attendance data available</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {
                isModalOpen && (
                    <div className={style.modal}>
                        <div className={style.modalContent}>
                            <span className={style.close} onClick={toggleModal}>&times;</span>
                            <h2>Yangi o'quvchi qo'shish</h2>
                            <label htmlFor="studentName">Ism</label>
                            <Select
                                name="student"
                                options={studentsData}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(selectedOption) => setNewStudentName(selectedOption.label)}
                            />
                            <label htmlFor="studentNumber">Telefon</label>
                            <input type="text" id="studentNumber" value={newStudentNumber} onChange={handleInputChangeNum} />
                            <button onClick={addStudentToGroup}>Qo'shish</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default Groups;