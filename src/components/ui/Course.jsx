import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
    getDatabase,
    ref,
    onValue,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { useEffect, useState } from "react";
const firebaseConfig = {
    apiKey: "AIzaSyC94X37bt_vhaq5sFVOB_ANhZPuE6219Vo",
    authDomain: "project-pro-7f7ef.firebaseapp.com",
    databaseURL: "https://project-pro-7f7ef-default-rtdb.firebaseio.com",
    projectId: "project-pro-7f7ef",
    storageBucket: "project-pro-7f7ef.firebasestorage.app",
    messagingSenderId: "782106516432",
    appId: "1:782106516432:web:d4cd4fb8dec8572d2bb7d5",
    measurementId: "G-WV8HFBFPND",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const Course = () => {
    const [CourseData, setCourseData] = useState([])

    useEffect(() => {
        const courseRef = ref(database, 'Courses');
        onValue(courseRef, (snapshot) => {
            const data = snapshot.val();
            const courseArray = Object.values(data);

            setCourseData(courseArray);
        });
    }, [])


    return (
        <div>
            <h1 className='text-3xl font-bold'>Course</h1>
            <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Courses:</span>
                    {CourseData.map((course, index) => (
                        <span key={index} className="text-gray-600">{course.name}</span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Duration:</span>
                    <span>6 months</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Instructor:</span>
                    <span>John Doe</span>
                </div>
            </div>
        </div>
    )
}

export default Course