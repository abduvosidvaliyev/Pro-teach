import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './Students.module.css';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { Search, Plus, FileSpreadsheet, MessageSquare, MoreVertical, ChevronDown } from 'lucide-react';



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

function Students() {
    const [students] = useState([
        {
            id: 1,
            name: "Umarxon Muxtorov",
            subject: "Bahosi yo'q",
            phone: "+998917382266",
            schedule: "09:00-10:30 - Web 1",
            status: "Faol",
            teacher: "Umarxon Muxtorov",
            balance: "307 692.31 so'm"
        }
    ]);
    const getCurrentMonth = () => {
        const now = new Date();
        const currentMonthAndYear = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        return currentMonthAndYear;
    };



    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isAdd, setIsAdd] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [studentInfo, setStudentInfo] = useState(null);
    const [studentsData, setStudentsData] = useState([]);
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentNumber, setNewStudentNumber] = useState();
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [showFilters, setShowFilters] = useState(false);



    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const toggleIsAdd = () => {
        setIsAdd(!isAdd);
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setNewStudentName(value);
        setSelectedOptions(prevState => ({
            ...prevState,
            studentName: value
        }));
    };
    const handleInputChangeNum = (event) => {
        const value = event.target.value;
        setNewStudentNumber(value);
        setSelectedOptions(prevState => ({
            ...prevState,
            studentNumber: value
        }));
    };

    useEffect(() => {
        const studentsRef = ref(database, 'Students');
        const unsubscribe = onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const studentsList = Object.keys(data).map(key => ({
                    ...data[key],
                }));
                setStudentsData(studentsList);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const studentsRef = ref(database, `Payments/${currentMonth}`);
        const unsubscribe = onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            setPaymentHistory(data ? Object.values(data) : []);
            console.log(data);
        });
        return () => unsubscribe();
    }, []);

    function addStudent() {
        if (newStudentName.trim() !== '') {
            const newStudent = {
                ...selectedOptions,
                studentName: newStudentName,
                id: studentsData.length + 1,
                group: "",
            };

            setStudents([...students, newStudentName]);
            setStudents([...students, newStudentNumber]);
            setStudentsData([...studentsData, newStudent]);

            const newStudentRef = ref(database, `Students/${newStudentName}`);
            set(newStudentRef, newStudent)
                .then(() => {
                    console.log('Student added to Firebase:', newStudent);
                })
                .catch((error) => {
                    console.error('Error adding student to Firebase:', error);
                });

            setNewStudentName('');
            setNewStudentNumber('');
        }
        console.log(studentsData);
    }


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
                            <li><i className="fa-regular fa-gem"></i><a href="#" className={style.dropdownItem}>Kurslar</a></li>
                            <li><i className="fa-solid fa-table-cells-large"></i><a href="#" className={style.dropdownItem}>Xonalar</a></li>
                            <li><i className="fa-solid fa-user-group"></i><a href="#" className={style.dropdownItem}>Xodimlar</a></li>
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
                    <h1>Talabalar: </h1>
                </div>
                <div className={style.studentAbout}>
                    <h2>Talabalar soni: {studentsData.length}</h2>
                    <div className={`${style.studentAdd} ${isAdd ? style.isAdd : ''}`}>
                        <span>
                            <h2>Yangi talaba qo'shish</h2>
                            <button onClick={toggleIsAdd}>❌</button>
                        </span>
                        <hr />
                        <label htmlFor="">Telefon</label>
                        <input type="text" onChange={handleInputChangeNum}
                        />
                        <label htmlFor="">Ismi</label>
                        <input
                            type="text"
                            value={newStudentName}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="">Tug'ilgan sana</label>
                        <input type="date" name="" id="" />

                        <button onClick={addStudent}>Saqlash</button>
                    </div>
                    <button className={style.studentAddButton} onClick={toggleIsAdd}>Add Student</button>
                </div>
                <div className={style.students}>

                    <div className="h-auto col-[1/11] p-3 sm:p-6">
                        <div className="max-w-7xl mx-auto">
                            {/* Header Section  */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex  items-center gap-2">
                                    <h1 className="text-xl font-medium">O'quvchilar</h1>
                                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">1</span>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors justify-center sm:justify-start">
                                    <Plus size={20} />
                                    <span className="hidden sm:inline">YANGI QO'SHISH</span>
                                    <span className="sm:hidden">QO'SHISH</span>
                                </button>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
                                {/* Filters Toggle for Mobile  */}
                                <button
                                    className="w-full md:hidden flex items-center justify-between p-2 mb-4 border rounded-lg"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <span>Filterlar</span>
                                    <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Filters Section */}
                                <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                                    <div className="flex flex-col md:flex-row flex-wrap gap-3 mb-6">
                                        <div className="relative w-full md:w-auto">
                                            <input
                                                type="text"
                                                placeholder="Qidirish"
                                                className="w-full md:w-auto pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                                        </div>

                                        <select className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>Kurslar</option>
                                        </select>

                                        <select className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>Maktab</option>
                                        </select>

                                        <select className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>Guruhdagi holati</option>
                                        </select>

                                        <select className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>To'lov holati</option>
                                        </select>

                                        <select className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>Guruh</option>
                                        </select>

                                        <select className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>Ustoz</option>
                                        </select>

                                        <div className="flex gap-2 w-full md:w-auto md:ml-auto">
                                            <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                                <FileSpreadsheet size={20} className="text-green-500" />
                                                <span className="hidden sm:inline">EXCEL</span>
                                            </button>
                                            <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                                <MessageSquare size={20} className="text-orange-500" />
                                                <span className="hidden sm:inline">SMS YUBORISH</span>
                                                <span className="sm:hidden">SMS</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Section */}
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[800px]">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ism familiya</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Baho</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Telefon raqam</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-60">Guruhlar</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">O'qituvchilari</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Balans</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Harakatlar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student.id} className="border-t">
                                                    <td className="px-4 py-4 text-sm">{student.id}</td>
                                                    <td className="px-4 py-4 text-sm">{student.name}</td>
                                                    <td className="px-4 py-4 text-sm">{student.subject}</td>
                                                    <td className="px-4 py-4 text-sm">{student.phone}</td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                                                            {student.status}
                                                        </span>
                                                        <div className="text-gray-600 mt-1">{student.schedule}</div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm">{student.teacher}</td>
                                                    <td className="px-4 py-4 text-sm">{student.balance}</td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <button className="p-1 hover:bg-gray-100 rounded">
                                                            <MoreVertical size={20} className="text-gray-400" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-4 mt-4">
                                    {students.map((student) => (
                                        <div key={student.id} className="border rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-medium">{student.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {student.id}</div>
                                                </div>
                                                <button className="p-1 hover:bg-gray-100 rounded">
                                                    <MoreVertical size={20} className="text-gray-400" />
                                                </button>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Baho:</span>
                                                    <span>{student.subject}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Telefon:</span>
                                                    <span>{student.phone}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Status:</span>
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                                                        {student.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Jadval:</span>
                                                    <span>{student.schedule}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">O'qituvchi:</span>
                                                    <span>{student.teacher}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Balans:</span>
                                                    <span>{student.balance}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default Students;



