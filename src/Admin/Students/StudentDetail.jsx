import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import style from './StudentDetail.module.css';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import userImage from '../Students/userImg.png';

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

const StudentDetail = () => {
  const getCurrentMonth = () => {
    const now = new Date();
    const currentMonthAndYear = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    return currentMonthAndYear;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [paymentPrice, setPaymentPrice] = useState("");
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [payments, setPayments] = useState(null);
  const [dateValue, setDateValue] = useState(getCurrentDate());

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleDropdown = (index) => setActiveDropdown(activeDropdown === index ? null : index);
  const toggleIsAdd = (student = null) => {
    setIsAdd(!isAdd);
    setEditingStudent(student);
    setNewStudentName(student ? student.studentName : '');
    setNewStudentNumber(student ? student.studentNumber : '');
  };

  const handleInputChange = (event) => setNewStudentName(event.target.value || '');
  const handleInputChangeNum = (event) => setNewStudentNumber(event.target.value || '');

  const addStudent = () => {
    if (newStudentName.trim() === '') {
      console.log('Student name is required');
      return;
    }

    const newStudent = {
      studentName: newStudentName,
      studentNumber: newStudentNumber,
      id: editingStudent?.id ?? (studentsData.length > 0 ? Math.max(...studentsData.map(s => s.id)) + 1 : 1),
    };

    const studentRef = ref(database, `Students/${newStudentName}`);
    set(studentRef, newStudent)
      .then(() => {
        console.log('Student added/updated in Firebase:', newStudent);
        setStudentsData(editingStudent ? studentsData.map(s => s.id === editingStudent.id ? newStudent : s) : [...studentsData, newStudent]);
        setNewStudentName('');
        setNewStudentNumber('');
        setEditingStudent(null);
      })
      .catch((error) => console.error('Error adding/updating student in Firebase:', error));
  };


  const handlePaymentPrice = (event) => setPaymentPrice(event.target.value);
  const handleDateChange = (event) => setDateValue(event.target.value);




  const deleteStudent = (studentId, studentName) => {
    const updatedStudentsData = studentsData.filter(student => student.id !== studentId);
    setStudentsData(updatedStudentsData);

    const studentRef = ref(database, `Students/${studentName}`);
    set(studentRef, null)
      .then(() => {
        console.log('Student deleted from Firebase:', studentName);
        navigate(updatedStudentsData.length > 0 ? `/student/${updatedStudentsData[0].id}` : '/students');
      })
      .catch((error) => console.error('Error deleting student from Firebase:', error));
  };

  const addPayment = () => {
    const newPayment = {
      studentName: student.studentName,
      studentNumber: student.studentNumber,
      studentPayment: paymentPrice,
      paymentDate: dateValue,
    };

    const newPaymentRef = ref(database, `Payments/${currentMonth}/${student.studentName}`);
    set(newPaymentRef, newPayment)
      .then(() => {
        console.log('Payment added to Firebase:', newPayment);
      })
      .catch((error) => {
        console.error('Error adding payment to Firebase:', error);
      });

    setPaymentPrice('');
    setPaymentDates([...paymentDates, dateValue]);
  };


  useEffect(() => {
    const studentsRef = ref(database, 'Students');
    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      setStudentsData(data ? Object.values(data) : []);
    });
    return () => unsubscribe();
  }, []);


  const student = studentsData.find((s) => s.id === parseInt(id));

  useEffect(() => {
    if (student) {
      const paymentsRef = ref(database, `Payments/${currentMonth}/${student.studentName}/studentPayment`);
      const unsubscribe = onValue(paymentsRef, (snapshot) => {
        const data = snapshot.val();
        setPayments(data ? Object.values(data) : []);
      });
      return () => unsubscribe();
    }
  }, [student, currentMonth]);

  if (!student) return <h2>Student not found</h2>;


  const toggleIsAddVisible = () => {
    setIsAddVisible(!isAddVisible);
  };

  return (
    <div>
      <div className={`${style.sidebar} ${isCollapsed ? style.collapsed : ''}`}>
        <div className={style.sidebarHeader}>
          <h3 className={style.brand}><i className="fas fa-anchor"></i><span>MyApp</span></h3>
          <div className={style.toggleBtn} onClick={toggleSidebar}>
            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} ${style.toggleIcon}`}></i>
          </div>
        </div>
        <ul className={style.navLinks}>
          <li><Link to="/panel" className={style.navItem}><span className={style.navIcon}><i className="fas fa-home"></i></span><span>Home</span></Link></li>
          <li><Link to="/control" className={style.navItem}><span className={style.navIcon}><i className="fa-solid fa-sliders"></i></span><span>Boshqaruv</span></Link></li>
          <li><Link to="/students" className={style.navItem}><span className={style.navIcon}><i className="fas fa-user"></i></span><span>Talabalar</span></Link></li>
          <li><Link to="/dashboard" className={style.navItem}><span className={style.navIcon}><i className="fa-solid fa-chart-line"></i></span><span>Dashboard</span></Link></li>
          <li className={`${style.dropdown} ${activeDropdown === 0 ? style.active : ''}`}>
            <a href="#" className={`${style.navItem} ${style.dropdownToggle}`} onClick={() => toggleDropdown(0)}>
              <div><span className={style.navIcon}><i className="fas fa-cogs"></i></span><span>Settings</span></div>
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

      <div className={style.main} style={{ marginLeft: isCollapsed ? '6%' : '250px', width: isCollapsed ? 'calc(100% - 6%)' : 'calc(100% - 250px)', transition: 'all 0.5s ease, background 0.3s ease, width 0.5s ease' }}>
        <div className={`${style.studentAdd} ${isAdd ? style.isAdd : ''}`}>
          <span>
            <h2>Yangi talaba qo'shish</h2>
            <button onClick={toggleIsAdd}>❌</button>
          </span>
          <hr />
          <label htmlFor="">Ism</label>
          <input type="text" value={newStudentName || ''} onChange={handleInputChange} />
          <label htmlFor="">Telefon</label>
          <input type="text" value={newStudentNumber || ''} onChange={handleInputChangeNum} />
          <label htmlFor="">Tug'ilgan sana</label>
          <input type="date" name="" id="" value={getCurrentDate()} />
          <button onClick={addStudent}>Saqlash</button>
        </div>

        <h1>Student Details</h1>
        <div className={style.studentActive}>
          <img src={userImage} alt="" />
          <p className={style.Id}><strong>Id: </strong> {student.id}</p>
          <p className={style.name}><strong>Student Name: </strong> {student.studentName}</p>
          <p className={style.number}><strong>Student Number: </strong> {student.studentNumber}</p>
          <p><b>Student Group: </b>{student.group ? student.group : "O'quvchi hali guruhga kiritilmagan !"}</p>
          <p><b>To'lov holati: </b>{payments ? <span><b>{payments}</b></span> : "To'lanmagan"}</p>

          <div className={style.crud}>
            <i className="fa-solid fa-pen" onClick={() => toggleIsAdd(student)}></i>
            <i className="fa-regular fa-trash-can" onClick={() => deleteStudent(student.id, student.studentName)}></i>
            <i onClick={toggleIsAdd} className="fa-solid fa-plus"></i>
            <i onClick={toggleIsAddVisible} className="fa-solid fa-money-bill"></i>
            {isAddVisible && (
              <div className={style.slidePayment}>
                <h2>Oylik to'lovni to'lash</h2>
                <button onClick={toggleIsAddVisible}>❌</button>
                <input type="number" onChange={handlePaymentPrice} value={paymentPrice} placeholder='Summa' />
                <input type="date" value={dateValue} onChange={handleDateChange} />
                <button onClick={addPayment}>To'lash</button>
              </div>
            )}
          </div>
        </div>
        <div className={style.students}>
          {studentsData.map((student) => (
            <Link to={`/student/${student.id}`} key={student.id} className={style.student}>
              {student.studentName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
